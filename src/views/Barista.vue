<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <div class="d-flex align-center justify-space-between">
            <h3 class="text-brown-lighten-1">Kitchen</h3>
            <v-btn @click="fetchCurrentOrders" icon>
                <v-icon>mdi-refresh</v-icon>
            </v-btn>
        </div>
        <v-sheet v-if="this.orders.length === 0" class="d-flex flex-column align-center text-center mx-auto mt-5" elevation="4" height="300" width="100%"
            rounded>
            <div class="w-50 mt-14">
                <v-icon :size="iconSize" icon="mdi-food-off" class="text-red-darken-2 mb-3"></v-icon>
                <h2 class="text-red-darken-2 mb-3">No order found!</h2>
                <p class="text-grey mb-3">Looks like there is no currently order yet.</p>
            </div>
        </v-sheet>
        <v-row class="mt-2">
            
            <v-col v-for="order in currentOrders" :key="order.reference_number" cols="12" lg="4" md="6" sm="6">
                <v-card :class="{'active-card': activeCards[order.reference_number]}" @click="handleCardClick(order.reference_number)">
                    <v-card-title>
                        <h5><v-icon>mdi-table-chair</v-icon>&nbsp; Table #: {{ order.table_number }}</h5>
                        <v-spacer></v-spacer>
                    </v-card-title>
                    <v-card-text>
                        <v-alert v-if="!order.order_items || order.order_items.length === 0" type="warning"
                            variant="tonal">
                            No order found for this table
                        </v-alert>
                        <div v-else v-for="(item, index) in order.order_items" :key="index"
                            class="d-flex align-center justify-space-between mt-1">
                            <p class="me-2" style="max-width: 120px;">
                                {{ item.product_name }}{{ item.temp_label }}{{ item.size_label }}
                            </p>
                            <p class="me-2">x{{ item.quantity }}</p>
                            <v-chip :color="getStatusColor(item.station_status_id)"
                                :prepend-icon="getStatusIcon(item.station_status_id)" @click="changeStatus(item)"
                                size="small" variant="flat" class="text-white">
                                {{ getStatusName(item.station_status_id) }}
                            </v-chip>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <span class="ms-3">Ref. #: {{ order.reference_number }}</span>
                    </v-card-actions>
                </v-card>
            </v-col>

        </v-row>
        <Snackbar ref="snackbarRef" />
    </v-container>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { useBranchStore } from '@/stores/branchStore';
import { useTransactStore } from '@/stores/transactionStore';
import { useStocksStore } from '@/stores/stocksStore';
import { useLoadingStore } from '@/stores/loading';
import { reactive } from 'vue';
import Snackbar from '@/components/Snackbar.vue';
import { TRANSACTION_API } from '@/api/transactionApi';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Barista',
    components: {
        Snackbar,
    },
    data() {
        return {
            iconSize: "70px",
            stockNotifQty: null,
            orders: [],
            loadingCurrentOrders: false,
            station_statuses: [],
        }
    },
    mounted() {
        this.orders.forEach(order => {
            order.order_items.forEach(item => {
                TRANSACTION_API.subscribeToStatusUpdates(item.station_status_id, (data) => {
                    console.log('Real-time update:', data);
                    // Update your local data here
                    const orderItem = this.orders
                        .flatMap(o => o.order_items)
                        .find(i => i.station_status_id === data.new_status);
                    if (orderItem) {
                        orderItem.station_status_id = data.new_status;
                    }
                });
            });
        });
        this.fetchCurrentOrders();
    },
    setup() {
        const authStore = useAuthStore();
        const branchStore = useBranchStore();
        const transactStore = useTransactStore();
        const stocksStore = useStocksStore();
        const loadingStore = useLoadingStore();
        const activeCards = reactive({});
        const handleCardClick = (referenceNumber) => {
            activeCards[referenceNumber] = true;
            setTimeout(() => {
                activeCards[referenceNumber] = false;
            }, 2000);
        };
        return { authStore, branchStore, transactStore, stocksStore, loadingStore, activeCards, handleCardClick };
    },
    computed: {
        currentOrders() {
            return this.orders.map(order => ({
                ...order,
                order_items: order.order_items || []
            }));
        },
    },
    methods: {
        async fetchCurrentOrders() {
            this.loadingStore.show("Loading orders...");
            this.loadingCurrentOrders = true;
            try {
                this.fetchLowStocks();
                this.fetchStationStatus();
                await this.transactStore.fetchAllCurrentOrdersStore();
                const orders = [];
                await Promise.all(this.transactStore.currentOrders.map(async (order) => {
                    try {
                        const response = await this.transactStore.fetchKitchenProductDetailsStore(order.transaction_id);
                        if (response?.data) {
                            orders.push({
                                transaction_id: response.data.transaction_id,
                                table_number: response.data.table_number,
                                reference_number: order.reference_number, // Only from initial response
                                order_items: response.data.all_orders || [],
                                customer_name: response.data.customer_name,
                                total_amount: response.data.total_amount,
                                order_status_id: response.data.order_status_id
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching details for order ${order.transaction_id}:`, error);
                        orders.push({
                            transaction_id: order.transaction_id,
                            table_number: order.table_number,
                            reference_number: order.reference_number,
                            order_items: [],
                            error: true
                        });
                        this.loadingStore.hide();
                    }
                }));
                this.orders = orders;
            } catch (error) {
                console.error('Error fetching current orders:', error);
                this.showError("Error fetching current orders!");
                this.orders = []; // Clear orders on major error
            } finally {
                this.loadingCurrentOrders = false;
                this.loadingStore.hide();
            }
        },

        async fetchStationStatus() {
            try {
                await this.transactStore.fetchAllStationStatusStore();
                this.station_statuses = this.transactStore.stationStatuses;
            } catch (error) {
                console.error('Error fetching station status:', error);
                this.showError("Error fetching station status!");
            }
        },

        async fetchLowStocks() {
            try {
                await this.stocksStore.fetchLowStocksStore(this.authStore.branchId);
                if (this.stocksStore.stock_alert_qty === 0) {
                this.stockNotifQty = 0;
                } else {
                this.stockNotifQty = this.stocksStore.stock_alert_qty;
                this.showError(`${ this.stockNotifQty } ${ this.stockNotifQty > 1 ? 'stocks' : 'stock' } has currently low quantity.`);
                console.log("Low stock qty:", this.stockNotifQty);
                }
            } catch (error) {
                console.error('Error fetching stocks:', error);
            }
        },

        getStatusName(statusId) {
            const status = this.station_statuses.find(s => s.station_status_id === statusId);
            return status ? status.station_status : 'Unknown';
        },

        getStatusColor(statusId) {
            switch (statusId) {
                case 1: return 'orange'; // Add to tray
                case 2: return 'green';  // Added to tray
                default: return 'grey';  // Unknown status
            }
        },

        getStatusIcon(statusId) {
            switch (statusId) {
                case 1: return 'mdi-information-outline';  // Add to tray
                case 2: return 'mdi-check'; // Added to tray
                default: return 'mdi-help-circle'; // Unknown
            }
        },

        async changeStatus(order) {
            if (!order || !order.transaction_id) {
                this.showError("Invalid order data!");
                return;
            }
            const currentStatusIndex = this.station_statuses.findIndex(
                status => status.station_status_id === order.station_status_id
            );
            if (currentStatusIndex === -1) {
                this.showError("Cannot determine current order status");
                return;
            }
            const nextStatusIndex = (currentStatusIndex + 1) % this.station_statuses.length;
            const newStatus = this.station_statuses[nextStatusIndex].station_status_id;
            this.loadingStore.show("Updating status...");
            try {
                await this.transactStore.updateKitchenProductStatusStore(order.transaction_id, newStatus);
                const statusName = this.getStatusName(newStatus);
                this.showSuccess(`${order.product_name}${order.temp_label}${order.size_label} is ${statusName}`);
                order.station_status_id = newStatus;
                this.fetchLowStocks();
                this.loadingStore.hide();
            } catch (error) {
                console.error('Error updating status:', error);
                this.showError("Failed to update. Please try again!");
                this.loadingStore.hide();
            }
        },

        showError(message) {
            this.$refs.snackbarRef.showSnackbar(message, "error");
        },

        showSuccess(message) {
            this.$refs.snackbarRef.showSnackbar(message, "success");
        },
    },
};
</script>

<style scoped>
.descriptionColor {
    color: #a3a3a3;
}

.v-card {
    transition: all 0.3s ease;
    /* background-color: white; */
}

.v-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: rgba(72, 169, 166);
}

.v-card.active-card {
    background-color: rgba(72, 169, 166) !important;
    transition: background-color 0.5s ease 3s;
    color: #fff8f8;
}

.v-chip {
    cursor: pointer;
    transition: all 0.2s ease;
}

.v-chip:hover {
    opacity: 0.9;
    transform: scale(1.05);
}
</style>

<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <h3>Kitchen</h3>
        <v-btn @click="this.fetchCurrentOrders" class="refresh" color="#0090b6" variant="flat" icon>
            <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-sheet v-if="this.orders.length === 0" class="d-flex flex-column align-center text-center mx-auto mt-5"
            elevation="4" height="300" width="100%" rounded>
            <div class="mt-14">
                <v-icon :size="iconSize" icon="mdi-food-off" class="text-red-darken-2 mb-3"></v-icon>
                <h2 class="text-red-darken-2 mb-3">No order found!</h2>
                <p class="text-grey mb-3 mx-3">Looks like there is no order found for kitchen station.</p>
            </div>
        </v-sheet>
        <v-row class="mt-1">
            <v-col v-for="order in currentOrders" :key="order.reference_number" cols="12" lg="4" md="6" sm="6">
                <v-card :class="{ 'active-card': activeCards[order.reference_number] }"
                    @click="handleCardClick(order.reference_number)">
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
                            <span class="me-2" style="max-width: 120px;">
                                {{ item.product_name }}{{ item.temp_label }}{{ item.size_label }}
                            </span>
                            <span class="me-2" style="font-size: 18px;"><strong>x{{ item.quantity }}</strong></span>
                            <v-chip :color="getStatusColor(item.station_status_id)"
                                :prepend-icon="getStatusIcon(item.station_status_id)"
                                :disabled="item.station_status_id === 2" size="small" 
                                variant="flat" 
                                class="text-white"
                                @click.stop="openChangeStatusDialog(item)">
                                {{ getStatusName(item.station_status_id) }}
                            </v-chip>

                            <!-- Dialog for this specific item -->
                            <v-dialog v-model="item.showDialog" width="400" transition="dialog-bottom-transition">
                                <v-btn @click="item.showDialog = false" color="#0090b6" class="position-absolute" size="small"
                                    style="top: -20px; right: -17px; z-index: 10;" icon>
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                                <v-card class="pa-3">
                                    <h3>Confirmation</h3>
                                    <div class="ms-2 my-3 d-flex flex-column">
                                        <span style="font-size: 16px;">
                                            <strong>Table #: {{ order.table_number }}</strong>
                                        </span>
                                        <span class="mt-1" style="font-size: 16px;">
                                            <strong>{{ item.product_name }}{{ item.temp_label }}{{ item.size_label }} &nbsp; &nbsp; &nbsp; x{{ item.quantity }}</strong>
                                        </span>
                                    </div>
                                    <span class="my-2 text-center">Are you done with this order?</span>
                                    <v-card-actions class="d-flex">
                                        <v-btn color="red" variant="tonal" class="px-3 pt-1 pb-6" prepend-icon="mdi-close"
                                            @click="item.showDialog = false">Not yet!
                                        </v-btn>
                                        <v-spacer></v-spacer>
                                        <v-btn color="green" variant="tonal" class="px-3 pt-1 pb-6" prepend-icon="mdi-check"
                                            @click="changeStatus(item); item.showDialog = false">Yes, I am!
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </div>
                    </v-card-text>
                    <v-card-actions>
                        <span class="ms-3" style="color: #0090b6;">Ref. #: {{ order.reference_number }}</span>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <Snackbar ref="snackbarRef" />
        <Alert ref="alertRef" />
    </v-container>
</template>

<script>
import { reactive } from 'vue';
import { mapState } from 'pinia';
import { useAuthStore } from '@/stores/auth';
import { useBranchStore } from '@/stores/branchStore';
import { useTransactStore } from '@/stores/transactionStore';
import { useStocksStore } from '@/stores/stocksStore';
import { useLoadingStore } from '@/stores/loading';
import Snackbar from '@/components/Snackbar.vue';
import Alert from '@/components/Alert.vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Barista',
    components: {
        Snackbar,
        Alert,
    },
    data() {
        return {
            iconSize: "70px",
            stockNotifQty: null,
            orders: [],
            station_statuses: [],
            loadingCurrentOrders: false,
            changeStatusDialog: false,
        }
    },
    mounted() {
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
        ...mapState(useStocksStore, ['stockNotificationQty']),
        currentOrders() {
            return this.orders.map(order => ({
                ...order,
                order_items: order.order_items || []
            }));
        },
    },
    methods: {
        async fetchCurrentOrders() {
            this.loadingStore.show("");
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
                                reference_number: order.reference_number,
                                order_items: Object.values(response.data.all_orders || {}).map(item => ({
                                    ...item,
                                    station_status_id: Number(item.station_status_id),
                                    showDialog: false
                                })),
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
                    }
                }));
                this.orders = orders;
            } catch (error) {
                console.error('Error fetching current orders:', error);
                this.showError("Error fetching current orders!");
                this.orders = [];
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
            this.changeStatusDialog = false;
            if (!order || !order.product_id || !order.transaction_id || !order.station_status_id) {
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
                await this.transactStore.updateKitchenProductStatusStore(order.product_id, order.transaction_id, newStatus);
                const statusName = this.getStatusName(newStatus);
                this.showSuccess(`${order.product_name}${order.temp_label}${order.size_label} is ${statusName}`);
                order.station_status_id = newStatus;
                this.fetchLowStocks();
                this.loadingStore.hide();
            } catch (error) {
                console.error('Error updating status:', error);
                this.showError("Failed to update. Please try again!");
            } finally {
                this.loadingStore.hide();
            }
        },

        async fetchLowStocks() {
            try {
                await this.stocksStore.fetchLowStocksStore(this.authStore.branchId);
                if (this.stockNotificationQty > 0) {
                    this.showAlert(`${this.stockNotificationQty} ${this.stockNotificationQty > 1 ? 'stocks' : 'stock'} has low quantity.`);
                }
            } catch (error) {
                console.error('Error fetching stocks:', error);
            }
        },

        showError(message) {
            this.$refs.snackbarRef.showSnackbar(message, "error");
        },

        showAlert(message) {
            this.$refs.alertRef.showSnackbarAlert(message, "error");
        },

        showSuccess(message) {
            this.$refs.snackbarRef.showSnackbar(message, "success");
        },

        openChangeStatusDialog(item) { 
            try {
                if (!item) return;
                item.showDialog = true;
            } catch (error) {
                console.error('Error opening dialog:', error);
                this.showError("Failed to open status dialog");
            }
        }
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
    background-color: rgb(255, 254, 250) !important;
}

.v-card.active-card {
    background-color: rgb(255, 254, 250) !important;
    transition: background-color 0.5s ease 3s;
}

.v-chip {
    cursor: pointer;
    transition: all 0.2s ease;
}

.v-chip:hover {
    opacity: 0.9;
    transform: scale(1.05);
}

.refresh {
    position: fixed;
    bottom: 15px;
    right: 15px;
    z-index: 1;
}
</style>

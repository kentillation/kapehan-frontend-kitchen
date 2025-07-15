<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <h3 class="text-brown-lighten-1">Main</h3>
        <v-row class="mt-2">
            <v-col v-for="order in currentOrders" :key="order.reference_number" cols="12" lg="4" md="6" sm="6">
                <v-card :class="{'active-card': activeCards[order.reference_number]}" @click="handleCardClick(order.reference_number)">
                    <v-card-title>
                        <h5><v-icon>mdi-table-chair</v-icon>&nbsp; Table: {{ order.table_number }}</h5>
                        <v-spacer></v-spacer>
                    </v-card-title>
                    <v-card-text>
                        <v-alert v-if="!order.order_items || order.order_items.length === 0" type="info"
                            variant="tonal">
                            No items found for this order
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
import { useLoadingStore } from '@/stores/loading';
import Snackbar from '@/components/Snackbar.vue';
import { reactive } from 'vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Barista',
    components: {
        Snackbar,
    },
    data() {
        return {
            orders: [],
            loadingCurrentOrders: false,
            station_statuses: [],
        }
    },
    setup() {
        const authStore = useAuthStore();
        const branchStore = useBranchStore();
        const transactStore = useTransactStore();
        const loadingStore = useLoadingStore();

        const activeCards = reactive({});
        const handleCardClick = (referenceNumber) => {
            activeCards[referenceNumber] = true;
            setTimeout(() => {
                activeCards[referenceNumber] = false;
            }, 2000);
        };
        return { authStore, branchStore, transactStore, loadingStore, activeCards, handleCardClick };
    },
    mounted() {
        this.fetchCurrentOrders();
        this.fetchStationStatus();
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
            this.loadingCurrentOrders = true;
            try {
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
                    }
                }));
                this.orders = orders;
            } catch (error) {
                console.error('Error fetching current orders:', error);
                this.showError("Error fetching current orders!");
                this.orders = []; // Clear orders on major error
            } finally {
                this.loadingCurrentOrders = false;
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
    color: #fff;
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
</style>

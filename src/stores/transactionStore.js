import { defineStore } from 'pinia';
import { TRANSACTION_API } from '@/api/transactionApi';

export const useTransactStore = defineStore('transactionData', {
    state: () => ({
        transactionData: null,
        currentOrders: [],
        orderStatuses: [],
        stationStatuses: [],
        orderDtls: [],
        orderDtlsData: [],
        orderQRCode: null,
        loading: false,
        error: null,
        success: false
    }),

    actions: {

        // New
        async fetchAllCurrentOrdersStore() {
            this.loading = true;
            this.error = null;
            try {
                if (!TRANSACTION_API || typeof TRANSACTION_API.fetchAllCurrentOrdersApi !== 'function') {
                    throw new Error('TRANSACTION_API service is not properly initialized');
                }
                const response = await TRANSACTION_API.fetchAllCurrentOrdersApi();
                if (response && response.status === true) {
                    this.currentOrders = response.data;
                } else {
                    throw new Error('Failed to fetch currentOrders');
                }
            } catch (error) {
                console.error('Error in fetchAllCurrentOrdersApi:', error);
                this.error = 'Failed to fetch currentOrders';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // New
        async fetchAllStationStatusStore() {
            this.loading = true;
            this.error = null;
            try {
                if (!TRANSACTION_API || typeof TRANSACTION_API.fetchAllStationStatusApi !== 'function') {
                    throw new Error('TRANSACTION_API service is not properly initialized');
                }
                const response = await TRANSACTION_API.fetchAllStationStatusApi();
                if (response && response.status === true) {
                    this.stationStatuses = response.data;
                } else {
                    throw new Error('Failed to fetch stationStatuses');
                }
            } catch (error) {
                console.error('Error in fetchAllStationStatusApi:', error);
                this.error = 'Failed to fetch order status';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        // New
        async fetchKitchenProductDetailsStore(transactionId) {
            this.loading = true;
            this.error = null;
            try {
                if (!transactionId) {
                    throw new Error('Invalid transactionId');
                }
                const response = await TRANSACTION_API.fetchKitchenProductDetailsApi(transactionId);
                if (response && response.status === true) {
                    this.orderDtls = response;
                    this.orderDtlsData = response.data;
                    return response;
                } else {
                    throw new Error(response?.message || 'Failed to fetch kitchen product details');
                }
            } catch (error) {
                console.error('Error fetching kitchen product details:', error);
                this.error = error.message || 'Failed to fetch kitchen product details';
                throw error;
            }
            finally {
                this.loading = false;
            }
        },

        // New
        async updateKitchenProductStatusStore(productId, transactionId, orderStatus) {
            this.loading = true;
            this.error = null;
            try {
                if (!productId || !transactionId || !orderStatus) {
                    throw new Error('Invalid transactionId or orderStatus');
                }
                const response = await TRANSACTION_API.updateKitchenProductStatusApi(productId, transactionId, orderStatus);
                if (response && response.status === true) {
                    this.currentOrders = this.currentOrders.map(order =>
                        order.id === transactionId ? { ...order, orderStatus } : order
                    );
                    return response;
                } else {
                    throw new Error(response?.message || 'Failed to update order orderStatus');
                }
            } catch (error) {
                console.error('Error updating order orderStatus:', error);
                this.error = error.message || 'Failed to update order orderStatus';
                throw error;
            }
            finally {
                this.loading = false;
            }
        },
        
        clearState() {
            this.transactionData = null;
            this.error = null;
            this.success = false;
        }
    },
});
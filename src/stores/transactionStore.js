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
        async submitTransactStore(transactionData, orderedProducts) {
            this.loading = true;
            this.error = null;
            this.success = false;
            try {
                if (!transactionData?.[0] || !Array.isArray(orderedProducts)) {
                    throw new Error('Invalid data');
                }
                const payload = {
                    ...transactionData[0],  // Flatten transaction object
                    products: orderedProducts
                };
                const response = await TRANSACTION_API.submitTransactionApi(payload);
                if (!response || response.status !== true) {
                    throw new Error(response?.message || 'Failed to submit transaction');
                }
                this.transactionData = response.data;
                this.success = true;
                return response;
            } catch (error) {
                console.error('Transaction submission failed:', error);
                this.error = error.message || 'Failed to submit transaction';
                throw error;
            } finally {
                this.loading = false;
            }
        },

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

        async fetchAllOrderStatusStore() {
            this.loading = true;
            this.error = null;
            try {
                if (!TRANSACTION_API || typeof TRANSACTION_API.fetchAllOrderStatusApi !== 'function') {
                    throw new Error('TRANSACTION_API service is not properly initialized');
                }
                const response = await TRANSACTION_API.fetchAllOrderStatusApi();
                if (response && response.status === true) {
                    this.orderStatuses = response.data;
                } else {
                    throw new Error('Failed to fetch orderStatuses');
                }
            } catch (error) {
                console.error('Error in fetchAllOrderStatusApi:', error);
                this.error = 'Failed to fetch order status';
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

        async fetchOrderDetailsStore(referenceNumber) {
            this.loading = true;
            this.error = null;
            try {
                if (!referenceNumber) {
                    throw new Error('Invalid referenceNumber');
                }
                const response = await TRANSACTION_API.fetchOrderDetailsApi(referenceNumber);
                if (response && response.status === true) {
                    // Store both the full response and the data separately
                    this.orderDtls = response;
                    this.orderDtlsData = response.data;
                    return response;
                } else {
                    throw new Error(response?.message || 'Failed to fetch order details');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                this.error = error.message || 'Failed to fetch order details';
                throw error;
            }
            finally {
                this.loading = false;
            }
        },

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

        async fetchOrderDetailsTempStore(referenceNumber) {
            this.loading = true;
            this.error = null;
            try {
                if (!referenceNumber) {
                    throw new Error('Invalid referenceNumber');
                }
                const response = await TRANSACTION_API.fetchOrderDetailsTempApi(referenceNumber);
                if (response && response.status === true) {
                    this.orderDtls = response;
                    this.orderDtlsData = response.data;
                    return response;
                } else {
                    throw new Error(response?.message || 'Failed to fetch order details');
                }
            } catch (error) {
                console.error('Error fetching order details:', error);
                this.error = error.message || 'Failed to fetch order details';
                throw error;
            }
            finally {
                this.loading = false;
            }
        },

        async fetchQRcodeTempStore(referenceNumber) {
            this.loading = true;
            this.error = null;
            try {
                if (!referenceNumber) {
                    throw new Error('Invalid referenceNumber');
                }
                const qrCodeBlob = await TRANSACTION_API.fetchOrderQRcodeTempApi(referenceNumber);
                if (qrCodeBlob) {
                    this.orderQRCode = qrCodeBlob;  // Store the blob directly
                    return qrCodeBlob;  // Return the blob directly
                } else {
                    throw new Error('Failed to fetch QR Code');
                }
            } catch (error) {
                console.error('Error fetching QR Code:', error);
                this.error = error.message || 'Failed to fetch QR Code';
                throw error;
            }
            finally {
                this.loading = false;
            }
        },

        async fetchQRcodeStore(referenceNumber) {
            this.loading = true;
            this.error = null;
            try {
                if (!referenceNumber) {
                    throw new Error('Invalid referenceNumber');
                }
                const qrCodeBlob = await TRANSACTION_API.fetchOrderQRcodeApi(referenceNumber);
                if (qrCodeBlob) {
                    this.orderQRCode = qrCodeBlob;  // Store the blob directly
                    return qrCodeBlob;  // Return the blob directly
                } else {
                    throw new Error('Failed to fetch QR Code');
                }
            } catch (error) {
                console.error('Error fetching QR Code:', error);
                this.error = error.message || 'Failed to fetch QR Code';
                throw error;
            }
            finally {
                this.loading = false;
            }
        },

        async updateOrderStatusStore(referenceNumber, orderStatus) {
            this.loading = true;
            this.error = null;
            try {
                if (!referenceNumber || !orderStatus) {
                    throw new Error('Invalid referenceNumber or orderStatus');
                }
                const response = await TRANSACTION_API.updateOrderStatusApi(referenceNumber, orderStatus);
                if (response && response.status === true) {
                    this.currentOrders = this.currentOrders.map(order =>
                        order.id === referenceNumber ? { ...order, orderStatus } : order
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

        async updateKitchenProductStatusStore(transactionId, orderStatus) {
            this.loading = true;
            this.error = null;
            try {
                if (!transactionId || !orderStatus) {
                    throw new Error('Invalid transactionId or orderStatus');
                }
                const response = await TRANSACTION_API.updateKitchenProductStatusApi(transactionId, orderStatus);
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
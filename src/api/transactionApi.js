import apiClient from '../axios';

export const TRANSACTION_API = {
    ENDPOINTS: {
        SUBMIT: '/submit-transaction',
        FETCH_CURRENT_ORDERS: '/current-orders',
        FETCH_ORDER_STATUS: '/order-status',
        FETCH_STATION_STATUS: '/station-status',
        FETCH_ORDER: '/order-details',
        FETCH_KITCHEN_PRODUCT: '/kitchen-product-details',
        FETCH_ORDER_TEMP: '/order-details-temp',
        FETCH_QR_TEMP: '/get-qr-temp',
        FETCH_QR: '/get-qr',
        CHANGE_STATUS: '/update-order-status',
        CHANGE_KITCHEN_STATUS: '/update-kitchen-product-status',
    },

    async submitTransactionApi(payload) {
        if (!payload || !payload.reference_number || !Array.isArray(payload.products)) {
            throw new Error('Invalid transaction data');
        }
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const response = await apiClient.post(
                this.ENDPOINTS.SUBMIT,
                payload, // Send direct payload without transactions wrapper
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[TransactionAPI] Error submitting data:', error);
            const errorMessage = error.response?.data?.message ||
                error.message ||
                'Failed to submit transaction data';
            const enhancedError = new Error(errorMessage);
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchAllCurrentOrdersApi() {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_CURRENT_ORDERS}`,
                config
            );

            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[TRANSACTION_API] Error fetching current orders:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch current orders'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchAllOrderStatusApi() {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_ORDER_STATUS}`,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[TRANSACTION_API] Error fetching order status:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch order status'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    // New
    async fetchAllStationStatusApi() {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_STATION_STATUS}`,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[TRANSACTION_API] Error fetching order status:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch order status'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchOrderDetailsApi(referenceNumber) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_ORDER}/${referenceNumber}`,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[TRANSACTION_API] Error fetching order status:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch order status'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchKitchenProductDetailsApi(transactionId) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_KITCHEN_PRODUCT}/${transactionId}`,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[TRANSACTION_API] Error fetching kitchen product status:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch kitchen product status'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchOrderDetailsTempApi(referenceNumber) {
        try {
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_ORDER_TEMP}/${referenceNumber}`,
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[TRANSACTION_API] Error fetching order status:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch order status'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchOrderQRcodeApi(referenceNumber) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                responseType: 'blob',
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_QR}/${referenceNumber}`,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[TRANSACTION_API] Error fetching order status:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch order status'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async fetchOrderQRcodeTempApi(referenceNumber) {
        try {
            const config = {
                responseType: 'blob',
            };
            const response = await apiClient.get(
                `${this.ENDPOINTS.FETCH_QR_TEMP}/${referenceNumber}`,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[TRANSACTION_API] Error fetching order status:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to fetch order status'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async updateOrderStatusApi(referenceNumber, orderStatus) {
        if (!referenceNumber || !orderStatus) {
            throw new Error('Invalid referenceNumber or orderStatus');
        }
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const response = await apiClient.put(
                `${this.ENDPOINTS.CHANGE_STATUS}`,
                { referenceNumber, orderStatus }, // Send direct payload without transactions wrapper
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[TRANSACTION_API] Error updating order orderStatus:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to update order orderStatus'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    },

    async updateKitchenProductStatusApi(transactionId, orderStatus) {
        if (!transactionId || !orderStatus) {
            throw new Error('Invalid transactionId or orderStatus');
        }
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) {
                throw new Error('No authentication token found');
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                }
            };
            const response = await apiClient.put(
                `${this.ENDPOINTS.CHANGE_KITCHEN_STATUS}`,
                { transactionId, orderStatus },
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[TRANSACTION_API] Error updating order orderStatus:', error);
            const enhancedError = new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to update order orderStatus'
            );
            enhancedError.response = error.response;
            enhancedError.status = error.response?.status;
            throw enhancedError;
        }
    }
};
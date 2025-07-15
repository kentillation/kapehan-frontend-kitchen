import apiClient from '../axios';

export const TRANSACTION_API = {
    ENDPOINTS: {
        FETCH_CURRENT_ORDERS: '/current-orders',
        FETCH_ORDER_STATUS: '/order-status',
        FETCH_STATION_STATUS: '/station-status',
        FETCH_ORDER: '/order-details',
        FETCH_KITCHEN_PRODUCT: '/kitchen-product-details',
        FETCH_ORDER_TEMP: '/order-details-temp',
        CHANGE_STATUS: '/update-order-status',
        CHANGE_KITCHEN_STATUS: '/update-kitchen-product-status',
    },

    // New
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

    // New
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

    // New
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
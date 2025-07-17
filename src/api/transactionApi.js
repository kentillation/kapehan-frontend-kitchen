import apiClient from '../axios';
import echo from '../resources/js/echo' ;

export const TRANSACTION_API = {
    ENDPOINTS: {
        FETCH_CURRENT_ORDERS: '/open/current-orders',
        FETCH_STATION_STATUS: '/kitchen/station-status',
        FETCH_KITCHEN_PRODUCT: '/open/kitchen-product-details',
        CHANGE_KITCHEN_STATUS: '/kitchen/update-kitchen-product-status',
    },

    // ==================== WEB SOCKET METHODS ====================
    subscribeToStatusUpdates(stationStatusId, callback) {
        echo.private(`update-station-status.${stationStatusId}`)
            .listen('.status.updated', callback) // Match the event class name in Laravel
        // echo.connector.pusher.connection.bind('state_change', (states) => {
        //     console.log('Pusher connection state changed:', states)
        // });
        // echo.connector.pusher.connection.bind('error', (err) => {
        //     console.error('Pusher error:', err)
        // });
        return () => echo.leave('update-station-status')
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
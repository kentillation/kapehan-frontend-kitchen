import apiClient from '../axios';

export const TRANSACTION_API = {
    ENDPOINTS: {
        FETCH_CURRENT_ORDERS: '/open/current-orders',
        FETCH_STATION_STATUS: '/kitchen/station-status',
        FETCH_KITCHEN_PRODUCT: '/open/kitchen-product-details',
        CHANGE_KITCHEN_STATUS: '/kitchen/update-kitchen-product-status',
    },

    /**
     * Starts polling for station status updates
     * @param {function} callback - Callback function (error, status)
     * @param {number} interval - Polling interval in ms (default: 3000)
     * @returns {function} Function to stop polling
     */
    startStationStatusPolling(callback, interval = 3000) {
        let isActive = true;
        let timeoutId = null;
        const poll = async () => {
            if (!isActive) return;

            try {
                const status = await this.fetchAllStationStatusApi();
                callback(null, status);
            } catch (error) {
                callback(error, null);
            } finally {
                if (isActive) {
                    timeoutId = setTimeout(poll, interval);
                }
            }
        };
        const stopPolling = () => {
            isActive = false;
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
            console.log('[Polling] Stopped');
        };
        console.log('[Polling] Starting...');
        poll();
        return stopPolling;
    },

    /**
     * Establishes WebSocket connection for real-time updates
     * @param {function} callback - Callback function (error, status)
     * @returns {function} Function to close WebSocket connection
     */
    connectStationStatusWebSocket(callback) {
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) {
            throw new Error('No authentication token found');
        }
        const apiBaseUrl = apiClient.baseURL || window.location.origin;
        const wsProtocol = apiBaseUrl.startsWith('https') ? 'wss' : 'ws';
        const wsBaseUrl = apiBaseUrl.replace(/^https?:\/\//, '');
        const wsUrl = `${wsProtocol}://${wsBaseUrl}/api/kitchen/station-status?token=${encodeURIComponent(authToken)}`;
        console.log('[WebSocket] Connecting to:', wsUrl);
        const socket = new WebSocket(wsUrl);
        socket.onopen = () => {
            console.log('[WebSocket] Connection established');
        };
        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                callback(null, data);
            } catch (error) {
                callback(new Error('Failed to parse WebSocket message'), null);
            }
        };
        socket.onerror = (error) => {
            console.error('[WebSocket] Error:', error);
            callback(new Error('WebSocket error occurred'), null);
        };
        socket.onclose = (event) => {
            console.log(`[WebSocket] Connection closed`, event);
            if (!event.wasClean) {
                callback(new Error('WebSocket connection closed unexpectedly'), null);
            }
        };
        return () => {
            console.log('[WebSocket] Closing connection');
            socket.close();
        };
    },

    /**
     * Manages real-time station status updates with automatic fallback
     * @param {function} callback - Callback function (error, status)
     * @param {object} options - Configuration options
     * @param {boolean} options.useWebSocket - Whether to try WebSocket first (default: true)
     * @param {number} options.pollingInterval - Polling interval in ms if WebSocket fails (default: 3000)
     * @returns {function} Function to stop updates
     */
    connectToStationStatusUpdates(callback, options = {}) {
        const {
            useWebSocket = true,
            pollingInterval = 3000
        } = options;
        let cleanupFn = null;
        if (useWebSocket && typeof WebSocket !== 'undefined') {
            try {
                console.log('[Connection] Attempting WebSocket connection');
                cleanupFn = this.connectStationStatusWebSocket(callback);
            } catch (error) {
                console.error('[Connection] WebSocket failed, falling back to polling', error);
                cleanupFn = this.startStationStatusPolling(callback, pollingInterval);
            }
        } else {
            console.log('[Connection] WebSocket not available, using polling');
            cleanupFn = this.startStationStatusPolling(callback, pollingInterval);
        }
        return () => {
            if (cleanupFn) {
                cleanupFn();
            }
        };
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
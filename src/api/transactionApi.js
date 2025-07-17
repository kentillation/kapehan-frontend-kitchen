import apiClient from '../axios';

export const TRANSACTION_API = {
    ENDPOINTS: {
        FETCH_CURRENT_ORDERS: '/open/current-orders',
        FETCH_STATION_STATUS: '/kitchen/station-status',
        FETCH_KITCHEN_PRODUCT: '/open/kitchen-product-details',
        CHANGE_KITCHEN_STATUS: '/kitchen/update-kitchen-product-status',
    },

    // Enhanced polling with better error handling and logging
    startStationStatusPolling(callback, interval = 3000) {
        let isActive = true;
        let timeoutId = null;
        let retryCount = 0;
        const maxRetries = 5;

        const poll = async () => {
            if (!isActive) return;

            try {
                console.debug('[Polling] Fetching station status...');
                const status = await this.fetchAllStationStatusApi();
                retryCount = 0; // Reset retry count on success
                callback(null, status);
            } catch (error) {
                retryCount++;
                console.error(`[Polling] Error (attempt ${retryCount}/${maxRetries}):`, error);
                callback(error, null);

                if (retryCount >= maxRetries) {
                    console.error('[Polling] Max retries reached, stopping');
                    return this.stopPolling();
                }
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

    // Enhanced WebSocket with better connection handling
    connectStationStatusWebSocket(callback) {
        const authToken = localStorage.getItem('auth_token');
        if (!authToken) {
            throw new Error('No authentication token found');
        }

        // Use the same host as your API client for consistency
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
                console.debug('[WebSocket] Message received');
                const data = JSON.parse(event.data);
                callback(null, data);
            } catch (error) {
                console.error('[WebSocket] Message parse error:', error);
                callback(new Error('Failed to parse WebSocket message'), null);
            }
        };

        socket.onerror = (error) => {
            console.error('[WebSocket] Error:', error);
            callback(error, null);
        };

        socket.onclose = (event) => {
            console.log(`[WebSocket] Connection closed (code: ${event.code}, reason: ${event.reason || 'none'})`);
            if (!event.wasClean) {
                callback(new Error('WebSocket connection closed unexpectedly'), null);
            }
        };

        return () => {
            console.log('[WebSocket] Closing connection');
            socket.close();
        };
    },

    // Smarter connection manager with auto-reconnect
    connectToStationStatusUpdates(callback, options = {}) {
        const {
            useWebSocket = true,
            pollingInterval = 3000,
            reconnectDelay = 5000
        } = options;

        let cleanupFn = null;
        let reconnectTimer = null;

        const connect = () => {
            // Clear any existing connection
            if (cleanupFn) {
                cleanupFn();
                cleanupFn = null;
            }

            if (useWebSocket && typeof WebSocket !== 'undefined') {
                try {
                    console.log('[Connection] Attempting WebSocket connection');
                    cleanupFn = this.connectStationStatusWebSocket((error, data) => {
                        if (error) {
                            console.error('[Connection] WebSocket error, will try polling', error);
                            // Fall back to polling on WebSocket error
                            connectWithPolling();
                        } else {
                            callback(null, data);
                        }
                    });
                } catch (error) {
                    console.error('[Connection] WebSocket setup failed, using polling', error);
                    connectWithPolling();
                }
            } else {
                connectWithPolling();
            }
        };

        const connectWithPolling = () => {
            console.log('[Connection] Starting polling');
            cleanupFn = this.startStationStatusPolling(callback, pollingInterval);
        };

        const scheduleReconnect = () => {
            if (reconnectTimer) clearTimeout(reconnectTimer);
            console.log(`[Connection] Will attempt reconnect in ${reconnectDelay}ms`);
            reconnectTimer = setTimeout(() => {
                connect();
            }, reconnectDelay);
        };

        // Initial connection
        connect();

        // Return cleanup function
        return () => {
            if (cleanupFn) cleanupFn();
            if (reconnectTimer) clearTimeout(reconnectTimer);
            console.log('[Connection] Cleanup complete');
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
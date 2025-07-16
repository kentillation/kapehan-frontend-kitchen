import apiClient from '../axios';

export const STOCK_API = {
    ENDPOINTS: {
        FETCH: '/stocks',
        FETCH_LOW_STOCKS: '/low-stocks',
    },

    /**
     * Stocks Information
     * @param {Object} stock - Stock data to update
     * @param {string|number} stock.stock_id - Required stock ID
     * @returns {Promise<Object>} Updated stock data
     * @throws {Error} Enhanced error with server response details
     */

    async fetchLowStocksApi(branchId) {
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
                `${this.ENDPOINTS.FETCH_LOW_STOCKS}/${branchId}`,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[StocksAPI] Error fetching stocks:', error);

            const enhancedError = new Error('Failed to fetch stocks');
            throw enhancedError;
        }
    },
    
    async fetchAllStocksApi(branchId) {
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
                `${this.ENDPOINTS.FETCH}/${branchId}`,
                config
            );
            if (!response.data) {
                throw new Error('Invalid response from server');
            }
            return response.data;
        } catch (error) {
            console.error('[StocksAPI] Error fetching stocks:', error);

            const enhancedError = new Error('Failed to fetch stocks');
            throw enhancedError;
        }
    },
};
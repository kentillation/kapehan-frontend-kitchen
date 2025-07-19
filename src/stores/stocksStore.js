import { defineStore } from 'pinia';
import { STOCK_API } from '@/api/stocksApi';

export const useStocksStore = defineStore('stocks', {
    state: () => ({
        stocks: [],
        stock_alert_qty: null,
        loading: false,
        error: null
    }),

    actions: {
        async fetchAllStocksStore(branchId) {
            this.loading = true;
            this.error = null;
            try {
                if (!STOCK_API || typeof STOCK_API.fetchAllStocksApi !== 'function') {
                    throw new Error('STOCK_API service is not properly initialized');
                }
                const response = await STOCK_API.fetchAllStocksApi(branchId);
                if (response && response.status === true) {
                    this.stocks = response.data;
                } else {
                    throw new Error('Failed to fetch stocks');
                }
            } catch (error) {
                console.error('Error in fetchAllStocksApi:', error);
                this.error = 'Failed to fetch stocks';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchLowStocksStore(branchId) {
            this.loading = true;
            this.error = null;
            try {
                if (!STOCK_API || typeof STOCK_API.fetchLowStocksApi !== 'function') {
                    throw new Error('STOCK_API service is not properly initialized');
                }
                const response = await STOCK_API.fetchLowStocksApi(branchId);
                if (response && response.status === true) {
                    this.stock_alert_qty = response.count;
                } else {
                    throw new Error('Failed to fetch stocks');
                }
            } catch (error) {
                console.error('Error in fetchLowStocksApi:', error);
                this.error = 'Failed to fetch stocks';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
    getters: {
        stockNotificationQty: (state) => state.stock_alert_qty || 0,
    }
});
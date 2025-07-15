import { defineStore } from 'pinia';
import { STOCK_API } from '@/api/stocksApi';

export const useStocksStore = defineStore('stocks', {
    state: () => ({
        stocks: [],
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

        async saveStocksStore(stocks) {
            this.loading = true;
            this.error = null;
            try {
                if (!STOCK_API || typeof STOCK_API.saveStocksApi !== 'function') {
                    throw new Error('STOCK_API service is not properly initialized');
                }
                const response = await STOCK_API.saveStocksApi(stocks);
                if (response && (response.status === true)) {
                    return response;
                } else {
                    throw new Error('Failed to save stocks');
                }
            } catch (error) {
                console.error('Error in saveStocksApi:', error);
                this.error = 'Failed to save stocks';
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateStockStore(stocks) {
            this.loading = true;
            this.error = null;
            try {
                if (!STOCK_API || typeof STOCK_API.updateStockApi !== 'function') {
                    throw new Error('STOCK_API service is not properly initialized');
                }
                const response = await STOCK_API.updateStockApi(stocks);
                if (response && response.status === true) {
                    return response;
                } else {
                    throw new Error('Failed to update stocks');
                }
            } catch (error) {
                console.error('Error in updateStockApi:', error);
                this.error = 'Failed to update stocks';
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },

    // getters: {
    //     getBranchNames: (state) => {
    //         return state.branches.map(branch => [
    //             typeof branch === 'object' ? branch.branch_name : branch, 
    //             'mdi-store-outline'
    //         ]);
    //     },

    //     getBranchById: (state) => (id) => {
    //         return state.branches.find(branch => branch.id === id);
    //     }
    // }
});
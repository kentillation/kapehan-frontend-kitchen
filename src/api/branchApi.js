import apiClient from '../axios';

export const BRANCH_API = {
    ENDPOINTS: {
        FETCH_ALL: '/shop-branches',
        CREATE: '/save-branch',
        DETAILS: '/branch-details'
    },

    async fetchBranches() {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) throw new Error('Authentication token not found');
            const response = await apiClient.get(this.ENDPOINTS.FETCH_ALL, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Failed to fetch branches');
            }
            return response.data;
        } catch (error) {
            console.error('[BranchService] Error fetching branches:', error);
            throw this._enhanceError(error, 'Failed to fetch branches');
        }
    },

    async createBranch(branchData) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) throw new Error('Authentication token not found');
            if (!branchData) {
                throw new Error('Branch data is required');
            }

            const response = await apiClient.post(
                this.ENDPOINTS.CREATE,
                branchData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            // Check if response exists and has data
            if (!response.data) {
                throw new Error('No data received from server');
            }

            // If success is false, throw error with message
            if (response.data.success === false) {
                throw new Error(response.data.message || 'Failed to create branch');
            }

            // If success is true, return the data
            return response.data;
        } catch (error) {
            console.error('[BranchService] Error creating branch:', error);
            throw this._enhanceError(error, 'Failed to create branch');
        }
    },

    async fetchBranchDetails(branchName) {
        try {
            const authToken = localStorage.getItem('auth_token');
            if (!authToken) throw new Error('Authentication token not found');
            if (!branchName) {
                throw new Error('Branch name is required');
            }

            const response = await apiClient.get(
                `${this.ENDPOINTS.DETAILS}/${branchName}`,
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            );

            if (!response.data?.success) {
                throw new Error(response.data?.message || 'Failed to fetch branch details');
            }

            return response.data;
        } catch (error) {
            console.error('[BranchService] Error fetching branch details:', error);
            throw this._enhanceError(error, 'Failed to fetch branch details');
        }
    },

    _enhanceError(error, defaultMessage) {
        const enhancedError = new Error(
            error.response?.data?.message ||
            error.message ||
            defaultMessage
        );
        enhancedError.response = error.response;
        enhancedError.status = error.response?.status;
        enhancedError.isApiError = true;
        return enhancedError;
    }
};
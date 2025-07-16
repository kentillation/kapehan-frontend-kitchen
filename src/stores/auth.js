import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();

    // State
    const shopName = ref(localStorage.getItem('shop_name') || null);
    const branchName = ref(localStorage.getItem('branch_name') || null);
    const branchLocation = ref(localStorage.getItem('branch_location') || null);
    const branchContact = ref(localStorage.getItem('contact') || null);
    const token = ref(localStorage.getItem('auth_token') || null);
    const shopId = ref(localStorage.getItem('shop_id') || null);
    const branchId = ref(localStorage.getItem('branch_id') || null); // added
    const error = ref(null);

    // Getters
    const isAuthenticated = computed(() => !!token.value);
    const getShopName = computed(() => shopName.value);
    const getBranchName = computed(() => branchName.value);
    const getBranchId = computed(() => branchId.value); //added
    const getBranchLocation = computed(() => branchLocation.value);
    const getBranchContact = computed(() => branchContact.value);

    // Actions
    const login = async (credentials) => {
        error.value = null;
        try {
            const response = await apiClient.post('/kitchen/login', credentials);
            
            if (response.status === 200) {
                token.value = response.data.access_token;
                shopId.value = response.data.shop_id;
                shopName.value = response.data.shop_name;
                branchId.value = response.data.branch_id; //added
                branchName.value = response.data.branch_name;
                branchLocation.value = response.data.branch_location;
                branchContact.value = response.data.contact;

                localStorage.setItem('auth_token', token.value);
                localStorage.setItem('shop_id', shopId.value);
                localStorage.setItem('shop_name', shopName.value);
                localStorage.setItem('branch_id', branchId.value); //added
                localStorage.setItem('branch_name', branchName.value);
                localStorage.setItem('branch_location', branchLocation.value);
                localStorage.setItem('contact', branchContact.value);

                return true;
            }
        } catch (err) {
            error.value = err.response?.data?.message ||
                err.message ||
                'Login failed. Please try again.';
            throw error.value;
        }
    };

    const logout = async () => {
        const currentToken = token.value;
        token.value = null;
        shopId.value = null;
        shopName.value = null;
        branchId.value = null; //added
        branchName.value = null;
        branchLocation.value = null;
        branchContact.value = null;
        error.value = null;
        localStorage.clear();
        try {
            if (currentToken) {
                await apiClient.post('/logout', null, {
                    headers: {
                        Authorization: `Bearer ${currentToken}`
                    },
                    timeout: 1000
                });
            }
        } catch (err) {
            console.error('Logout API error:', err);
        }
        window.location.href = '/';
    };

    const checkAuth = () => {
        if (!isAuthenticated.value && router.currentRoute.value.meta.requiresAuth) {
            logout();
        }
    };

    return {
        token,
        shopId,
        shopName,
        branchId, // added
        branchName,
        branchLocation,
        branchContact,
        getShopName,
        getBranchId, // addedd
        getBranchName,
        getBranchLocation,
        getBranchContact,
        isAuthenticated,
        error,
        login,
        logout,
        checkAuth,
    };
});
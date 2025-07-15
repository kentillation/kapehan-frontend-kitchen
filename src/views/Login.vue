<template>
    <v-container>
        <v-sheet class="py-8 px-6 mx-auto ma-4" max-width="500" rounded="lg" width="100%">
            <h1 class="text-center">Poofsa <span class="text-secondary">.kitch</span></h1>
            <v-form ref="form" @submit.prevent="handleLogin" v-model="isFormValid" class="pa-4">
                <div class="text-subtitle-1 text-medium-emphasis">Email</div>
                <v-text-field v-model="cashier_email" 
                    :rules="[requiredRule, emailFormatRule]"
                    placeholder="Type here..."
                    prepend-inner-icon="mdi-email-outline"
                    variant="outlined"
                    density="compact"
                    autocomplete="username" />

                <div class="text-subtitle-1 text-medium-emphasis mt-2">Password</div>
                <v-text-field v-model="cashier_password" 
                    :rules="[requiredRule]"
                    placeholder="Type here..."
                    prepend-inner-icon="mdi-lock-outline" 
                    variant="outlined"
                    density="compact" 
                    autocomplete="current-password"
                    :type="showPassword ? 'text' : 'password'"
                    :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye-outline'" 
                    @click:append-inner="showPassword = !showPassword" />

                <v-btn :disabled="!isFormValid || loading" type="submit" color="brown-darken-3" size="large" class="mt-5" height="45" block rounded>
                    Proceed
                </v-btn>
            </v-form>
            <h6 class="text-center text-grey mt-5">Poofsa .kitch UAT Version v1.0.0</h6>
        </v-sheet>
        <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="4000" top>
            {{ snackbar.message }}
        </v-snackbar>
    </v-container>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { shallowRef } from 'vue';

export default {
    name: 'LoginPage',
    setup() {
        const loadingStore = useLoadingStore();
        return {
            mpin: shallowRef(''),
            loadingStore,
        };
    },
    data() {
        return {
            cashier_email: '',
            cashier_password: '',
            showPassword: false,
            isFormValid: false,
            loading: false,
            snackbar: {
                visible: false,
                message: '',
                color: ''
            },
        };
    },
    methods: {
        requiredRule(v) {
            return !!v || 'This field is required';
        },
        emailFormatRule(v) {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return pattern.test(v) || 'Invalid email format';
        },
        async handleLogin() {
            const isValid = await this.$refs.form.validate();
            if (!isValid) return;

            this.loading = true;
            try {
                this.loadingStore.show('Logging in...');
                const authStore = useAuthStore();
                await authStore.login({ cashier_email: this.cashier_email, cashier_password: this.cashier_password });
                window.location.href = '/barista';
            } catch (error) {
                this.loadingStore.hide();
                this.showSnackbar(error || 'Login failed. Please try again!', 'error');
            } finally {
                this.loading = false;
            }
        },
        showSnackbar(message, color) {
            this.snackbar.message = message;
            this.snackbar.color = color;
            this.snackbar.visible = true;
        }
    }
};
</script>

<style scoped>
.v-container {
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: var(--v-theme-background);
}
.v-sheet {
    border: 1.5px solid rgb(72, 169, 166);
}
.v-input__details {
    display: flex;
}
</style>
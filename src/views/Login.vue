<template>
    <div class="login-bg">
        <v-container class="fill-height d-flex align-center justify-center">
            <v-sheet class="pa-6 mx-auto ma-4" max-width="500" rounded="lg" width="100%">
                <div class="d-flex justify-center mb-4">
                    <img :src="logo" loading="lazy" alt="Poofsa Logo" />
                </div>
                <h1 class="text-center">Poofsa <span class="text-red">.kitch</span></h1>
                <v-form ref="form" @submit.prevent="handleLogin" v-model="isFormValid" class="pa-4">
                    <div class="text-subtitle-1 text-medium-emphasis">Email</div>
                    <v-text-field v-model="kitchen_email" 
                        :rules="[requiredRule, emailFormatRule]"
                        placeholder="Type here..."
                        prepend-inner-icon="mdi-email-outline"
                        variant="outlined"
                        density="compact"
                        autocomplete="username" />

                    <div class="text-subtitle-1 text-medium-emphasis">Password</div>
                    <v-text-field v-model="kitchen_password" 
                        :rules="[requiredRule]"
                        placeholder="Type here..."
                        prepend-inner-icon="mdi-lock-outline" 
                        variant="outlined"
                        density="compact" 
                        autocomplete="current-password"
                        :type="showPassword ? 'text' : 'password'"
                        :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye-outline'" 
                        @click:append-inner="showPassword = !showPassword" />

                    <v-btn :disabled="!isFormValid || loading" type="submit" color="#0090b6" size="large" class="mt-5" height="45" block rounded>
                        Proceed
                    </v-btn>
                </v-form>
                <h6 class="text-center text-grey mt-5">Poofsa .kitch BETA Version v1.0.0</h6>
            </v-sheet>
            <v-snackbar v-model="snackbar.visible" :color="snackbar.color" timeout="4000" top>
                {{ snackbar.message }}
            </v-snackbar>
        </v-container>
    </div>
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
            logo: require('@/assets/Poofsa-logo.png'),
            kitchen_email: '',
            kitchen_password: '',
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
                this.loadingStore.show('');
                const authStore = useAuthStore();
                await authStore.login({ kitchen_email: this.kitchen_email, kitchen_password: this.kitchen_password });
                window.location.href = '/kitchen';
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
.login-bg {
    min-height: 100vh;
    min-width: 100vw;
    width: 100vw;
    height: 100vh;
    background: url('@/assets/Login-Bg.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
}

.login-bg::before {
    content: "";
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(8px) saturate(180%);
    -webkit-backdrop-filter: blur(8px) saturate(180%);
    z-index: 1;
    pointer-events: none;
    border-radius: inherit;
}

.v-container {
    display: grid;
    place-items: center;
    height: 100vh;
    position: relative;
    z-index: 2;
}

.v-sheet {
    position: relative;
    z-index: 3;
}

img {
    min-width: 70px;
    width: 25%;
    border-radius: 10px;
}

.v-input__details {
    display: flex;
}
</style>
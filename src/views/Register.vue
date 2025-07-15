<template>
    <div>
        <h1>Register</h1>
        <form @submit.prevent="register">
            <div>
                <label for="name">Name:</label>
                <input type="text" v-model="name" required>
            </div>
            <div>
                <label for="email">Email:</label>
                <input type="email" v-model="email" required>
            </div>
            <div>
                <label for="password">Password:</label>
                <input type="password" v-model="password" required>
            </div>
            <button type="submit">Register</button>
        </form>
    </div>
</template>

<script>
import apiClient from '../axios';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Register',
    data() {
        return {
            name: '',
            email: '',
            password: ''
        };
    },
    methods: {
        async register() {
            try {
                await apiClient.post('/register', {
                    name: this.name,
                    email: this.email,
                    password: this.password
                });
                this.$router.push('/');
            } catch (error) {
                console.error('Registration error:', error);
            }
        }
    }
};
</script>

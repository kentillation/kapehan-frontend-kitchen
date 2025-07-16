<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <v-container>
        <h2 class="text-brown-lighten-1">Settings</h2>
        <v-card class="pa-8 mt-3">
            <v-row>
                <v-col cols="12" lg="6" md="6" sm="12">
                    <h2><v-icon>mdi-account-circle-outline</v-icon>&nbsp; Account</h2>
                    <p class="descriptionColor mt-2">Change your account settings and change it later.</p>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12">
                    <v-container class="d-flex align-center justify-end">
                        <span class="descriptionColor"></span>
                        <v-btn class="ms-5" icon @click="openAccountDialog">
                            <v-icon class="descriptionColor">mdi-chevron-right</v-icon>
                        </v-btn>
                    </v-container>
                </v-col>
            </v-row>
            <v-divider class="my-4"></v-divider>
            <v-row>
                <v-col cols="12" lg="6" md="6" sm="12">
                    <h2><v-icon>mdi-theme-light-dark</v-icon>&nbsp; Theme</h2>
                    <p class="descriptionColor mt-2">Select your preferred theme and change it later.</p>
                </v-col>
                <v-col cols="12" lg="6" md="6" sm="12">
                    <v-container class="d-flex align-center justify-end">
                        <span class="descriptionColor">{{ currentThemeName }}</span>
                        <v-btn class="ms-5" icon @click="themeDialog = true">
                            <v-icon class="descriptionColor">mdi-chevron-right</v-icon>
                        </v-btn>
                    </v-container>
                </v-col>
            </v-row>
            <v-divider class="my-4"></v-divider>
        </v-card>
        <v-dialog v-model="accountDialog" width="500">
            <v-card class="pa-2">
                <v-card-title>
                    <h3>Account settings</h3>
                </v-card-title>
                <v-card-text>
                    <h2>Hello, World!</h2>
                </v-card-text>
                <v-spacer></v-spacer>
                <div class="d-flex justify-space-between pa-3">
                    <v-btn prepend-icon="mdi-magic-staff" color="primary" variant="tonal">Apply</v-btn>
                    <v-btn prepend-icon="mdi-information-outline" color="error" variant="tonal" @click="accountDialog = false">Change later</v-btn>
                </div>
            </v-card>
        </v-dialog>
        <v-dialog v-model="themeDialog" width="500">
            <v-card class="pa-2">
                <v-card-title>
                    <h3>Theme settings</h3>
                </v-card-title>
                <v-card-text>
                    <div class="d-flex flex-column">
                        <v-radio-group v-model="selectedTheme" class="ms-5">
                            <v-radio label="Dark" value="dark"></v-radio>
                            <v-radio label="Light" value="light"></v-radio>
                        </v-radio-group>
                    </div>
                </v-card-text>
                <v-spacer></v-spacer>
                <div class="d-flex justify-space-between pa-3">
                    <v-btn prepend-icon="mdi-magic-staff" color="primary" variant="tonal" @click="applyTheme">Apply</v-btn>
                    <v-btn prepend-icon="mdi-information-outline" color="error" variant="tonal" @click="themeDialog = false">Change later</v-btn>
                </div>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import { useTheme } from 'vuetify';
import { ref, computed } from 'vue';

export default {
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'Settings',
    data() {
        return {
            accountDialog: false,
        }
    },
    setup() {
        const theme = useTheme();
        const themeDialog = ref(false);
        const selectedTheme = ref(theme.global.name.value);

        const currentThemeName = computed(() => {
            return theme.global.name.value === 'dark' ? 'Dark' : 'Light';
        });

        const applyTheme = () => {
            theme.global.name.value = selectedTheme.value;
            localStorage.setItem('theme', selectedTheme.value);
            themeDialog.value = false;
        };

        return {
            theme,
            themeDialog,
            selectedTheme,
            currentThemeName,
            applyTheme
        };
    },
    methods: {
        openAccountDialog() {
            this.accountDialog = true;
        },
    },
};
</script>

<style scoped>
.descriptionColor {
    color: #a3a3a3;
}
</style>
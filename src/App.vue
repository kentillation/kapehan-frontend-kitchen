<template>
  <v-app dark>
    <div v-if="connectionStatus !== 'online'" class="connection-container">
      <div class="connection-banner" :class="connectionStatus">
        <v-icon left>
          {{ connectionStatusIcon }}
        </v-icon>
        <span>&nbsp;{{ connectionStatusText }}</span>
      </div>
    </div>
    <v-main>
      <template v-if="!isNotFoundPage">
        <v-app-bar v-if="showMenu" prominent>
          <v-btn @click.stop="drawer = !drawer" icon>
            <v-icon>mdi-menu</v-icon>
          </v-btn>
          <h3 class="ms-1">{{ authStore.shopName }}</h3>
          <v-spacer></v-spacer>
          <v-btn icon>
            <v-badge v-if="stockNotificationQty >= 1" 
              :content="stockNotificationQty" 
              class="position-absolute" 
              style="top: 3px; right: 9px;" 
              color="error">
            </v-badge>
            <v-icon>mdi-bell-outline</v-icon>
          </v-btn>
          <v-btn class="ms-0" icon>
            <v-icon @click="toSettings">mdi-account-circle-outline</v-icon>
          </v-btn>
        </v-app-bar>
        <v-navigation-drawer class="h-screen pa-3" v-model="drawer" v-if="showSidebar">
          <v-list density="compact" nav>
            <v-list-subheader size="30">Menu</v-list-subheader>
            <v-list-item prepend-icon="mdi-faucet-variant" @click="toBarista" class="ps-5 bg-brown-darken-3"
              style="border-radius: 30px;">Kitchen</v-list-item>
            <v-list-item prepend-icon="mdi-cog-outline" @click="toSettings" class="bg-brown-darken-3 ps-5"
              style="border-radius: 30px;">Settings</v-list-item>
            <v-list-item prepend-icon="mdi-door-open" @click="showLogout" class="ps-5 bg-brown-darken-3"
              style="border-radius: 30px;">Sign Out</v-list-item>
          </v-list>
        </v-navigation-drawer>
      </template>
      <v-layout>
        <router-view />
        <GlobalLoader />
      </v-layout>
    </v-main>
  </v-app>
</template>

<script>
import { mapState } from 'pinia';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useLoadingStore } from '@/stores/loading';
import { useStocksStore } from '@/stores/stocksStore';
import GlobalLoader from '@/components/GlobalLoader.vue';
import { useRoute } from 'vue-router';

export default {
  name: 'App',
  data () {
    return {
      stocks: [],
    }
  },
  components: {
    GlobalLoader,
  },
  async mounted() {
    await this.fetchLowStocks();
  },
  setup() {
    const authStore = useAuthStore();
    const stocksStore = useStocksStore(); 
    const loadingStore = useLoadingStore();
    const connectionStatus = ref('online');
    const route = useRoute();
    const isNotFoundPage = computed(() => route.name === 'NotFound');
    const updateStatus = () => {
      if (!navigator.onLine) {
        connectionStatus.value = 'offline';
      } else {
        connectionStatus.value = 'online';
      }
    };
    let waitingTimeout;
    const simulateWaiting = () => {
      connectionStatus.value = 'waiting';
      waitingTimeout = setTimeout(() => {
        connectionStatus.value = navigator.onLine ? 'online' : 'offline';
      }, 3000);
    };

    onMounted(() => {
      window.addEventListener('online', updateStatus);
      window.addEventListener('offline', updateStatus);
      simulateWaiting();
      if ('connection' in navigator) {
        navigator.connection.addEventListener('change', () => {
          if (navigator.connection.downlink < 1) {
            connectionStatus.value = 'slow';
          } else if (navigator.onLine) {
            connectionStatus.value = 'online';
          }
        });
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener('online', updateStatus);
      window.removeEventListener('offline', updateStatus);
      if (waitingTimeout) clearTimeout(waitingTimeout);
    });

    const connectionStatusText = computed(() => {
      switch (connectionStatus.value) {
        case 'offline':
          return 'No internet connection';
        case 'slow':
          return 'Low internet connection';
        case 'waiting':
          return 'Waiting for connection...';
        default:
          return '';
      }
    });

    const connectionStatusIcon = computed(() => {
      switch (connectionStatus.value) {
        case 'offline':
          return 'mdi-wifi-off';
        case 'slow':
          return 'mdi-wifi-alert';
        case 'waiting':
          return 'mdi-timer-sand';
        default:
          return '';
      }
    });

    return {
      authStore,
      stocksStore, 
      loadingStore,
      drawer: ref(true),
      open: ref(false),
      connectionStatus,
      connectionStatusText,
      connectionStatusIcon,
      isNotFoundPage,
    };
  },
  computed: {
    ...mapState(useStocksStore, ['stockNotificationQty']),
    showSidebar() {
      return this.$route.name !== 'LoginPage' && !this.isNotFoundPage;
    },
    showMenu() {
      return this.$route.name !== 'LoginPage' && !this.isNotFoundPage;
    },
  },
  methods: {
    // hideNotFoundPage() {
    //   return this.$route.name !== 'NotFound';
    // },
    toSettings() {
      this.$router.push('/settings');
    },
    toBarista() {
      this.$router.push('/barista');
    },
    async showLogout() {
      this.drawer = false;
      await this.authStore.logout();
    },
    toHelp() {
      this.$router.push('/help');
    },
    toAbout() {
      this.$router.push('/about');
    },
    async fetchLowStocks() {
      try {
        if (!this.authStore.branchId) {
          console.error('Error fetching low stocks!');
          this.stocks = [];
          return;
        }
        await this.stocksStore.fetchLowStocksStore(this.authStore.branchId);
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    },
  }
};
</script>
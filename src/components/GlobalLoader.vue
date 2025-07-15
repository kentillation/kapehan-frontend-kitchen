<template>
  <LoaderUI :visible="loadingStore.isLoading" :message="loadingStore.message" />
</template>

<script>
import { useLoadingStore } from '@/stores/loading';

export default {
  name: 'GlobalLoader',
  setup() {
    const loadingStore = useLoadingStore();
    return {
      loadingStore,
    };
  },
}
</script>
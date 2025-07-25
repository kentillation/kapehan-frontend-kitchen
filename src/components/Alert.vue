<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" location="top" class="mt-10" timeout="10000"
      persistent>
      <div class="d-flex align-items-center px-3">
        <span style="font-size: 18px;"><v-icon icon="mdi-information-outline"></v-icon></span>
        <span style="font-size: 18px;">&nbsp; {{ snackbar.message }}</span>
      </div>
    </v-snackbar>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      snackbar: {
        visible: false,
        message: '',
        color: ''
      },
    };
  },
  methods: {
    showSnackbarAlert(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.visible = true;
    },
  },
};
</script>
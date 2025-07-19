<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <v-container>
    <v-snackbar v-model="snackbar.visible" :color="snackbar.color" location="bottom" class="mb-5" timeout="5000">
        <div class="d-flex align-items-center px-3">
          <span><v-icon icon="mdi-information-outline"></v-icon></span>
          <span>&nbsp; {{ snackbar.message }}</span>
        </div>
    </v-snackbar></v-container>
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
    showSnackbar(message, color) {
      this.snackbar.message = message;
      this.snackbar.color = color;
      this.snackbar.visible = true;
    },
  },
};
</script>
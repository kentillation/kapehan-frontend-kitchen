/* eslint-disable no-undef */
const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
module.exports = defineConfig({
  transpileDependencies: true,
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://poofsa.centralcoffeeandtea.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        // Define the feature flag to eliminate the warning
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),

          // VUE_APP_PUSHER_KEY: JSON.stringify(process.env.VUE_APP_PUSHER_KEY),
          // VUE_APP_PUSHER_CLUSTER: JSON.stringify(process.env.VUE_APP_PUSHER_CLUSTER),
          // VUE_APP_PUSHER_HOST: JSON.stringify(process.env.VUE_APP_PUSHER_HOST),
          // VUE_APP_PUSHER_PORT: JSON.stringify(process.env.VUE_APP_PUSHER_PORT)

      })
    ]
  }
});
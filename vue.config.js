/* eslint-disable no-undef */
const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: true,
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://poofsa.kentillation.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
  configureWebpack: {
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          ...require('dotenv').config().parsed
        }
      })
    ]
  },
});
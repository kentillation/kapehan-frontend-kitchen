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
        'process.env': {
          // Don't redefine variables here unless absolutely necessary
        }
      })
    ]
  }
});
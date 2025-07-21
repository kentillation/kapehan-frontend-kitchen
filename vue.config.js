/* eslint-disable no-undef */
const { defineConfig } = require('@vue/cli-service');
const webpack = require('webpack');
const { VuetifyPlugin } = require('vuetify-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = defineConfig({
  transpileDependencies: true,
  productionSourceMap: true,
  pluginOptions: {
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
      styles: 'expose',
      autoImport: true
    }
  },
  devServer: {
    proxy: {
      '/api': {
        target: 'https://poofsa.kentillation.com',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
        secure: false // Only if you need to bypass SSL verification
      },
    },
    client: {
      overlay: {
        warnings: false,
        errors: true
      }
    }
  },
  configureWebpack: {
    performance: {
      hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
      maxAssetSize: 1024 * 1024 * 2, // 2 MiB
      maxEntrypointSize: 1024 * 1024 * 2 // 2 MiB
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          ...require('dotenv').config().parsed
        }
      }),
      new VuetifyPlugin({
        styles: { configFile: 'src/styles/settings.scss' }
      }),
      ...(process.env.ANALYZE ? [new BundleAnalyzerPlugin()] : []),
    ],
    resolve: {
      fallback: {
        path: require.resolve('path-browserify')
      }
    }
  },
  css: {
    extract: process.env.NODE_ENV === 'production' ? {
      ignoreOrder: true // Fixes CSS order warnings
    } : false
  }
});
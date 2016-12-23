const webpack = require('webpack')
const base = require('./webpack.base.config')
const HTMLPlugin = require('html-webpack-plugin')

const config = Object.assign({}, base, {
  resolve: {
    alias: Object.assign({}, base.resolve.alias, {
      // apiで利用するモジュールをserver側とclient側で切り分ける
      'create-api': './create-api-client.js'
    })
  },
  plugins: (base.plugins || []).concat([
    // strip comments in Vue code
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"client"'
    }),
    // extract vendor chunks for better caching
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    // generate output HTML
    new HTMLPlugin({
      template: 'src/index.template.html'
    })
  ])
})

module.exports = config

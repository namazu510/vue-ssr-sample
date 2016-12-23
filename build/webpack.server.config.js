const webpack = require('webpack')
const base = require('./webpack.base.config')

module.exports = Object.assign({}, base, {
  target: 'node',
  devtool: false,
  entry: './src/server-entry.js',
  output: Object.assign({}, base.output, {
    filename: 'server-bundle.js',
    libraryTarget: 'commonjs2'
  }),
  resolve: {
    alias: Object.assign({}, base.resolve.alias, {
      // apiで利用するモジュールをserver側とclient側で切り分ける
      'create-api': './create-api-server.js'
    })
  },
  externals: Object.keys(require('../package.json').dependencies),
  plugins: [
    new webpack.DefinePlugin({
      'process.env.VUE_ENV': '"server"'
    })
  ]
})

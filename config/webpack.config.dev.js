// webpack 的开发环境配置

//   config/webpack.config.dev.js

const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const path = require('path')

/**
 * @type {import('webpack').WebpackOptionsNormalized}
 */
// const devServer = {
//   port: 3000,
//   host: 'localhost',
//   contentBase: path.join(__dirname, '../publich'),
//   watchContentBase: true,
//   publicPath: '/',
//   compress: true,
//   historyApiFallback: true,
//   hot: true,
//   clientLogLevel: 'error',
//   // open: true,
//   watchOptions: {
//     ignored: /node_modules/,
//   },
// }
const devServer = {
  hot: true,
  port: 3001,
  host: 'localhost',
  compress: true,
  open: true,
  proxy: {
    '/api': {
      target: 'http://192.168.20.188:15179',
      changeOrigin: true,
      pathRewrite: {
        '/api': ''
      }
    },
  }
}

const devConfig = {
  mode: 'development',
  devServer: devServer,
}

module.exports = webpackMerge.merge(baseConfig, devConfig)


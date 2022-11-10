// webpack 的生产环境配置
//   config/webpack.config.prod.js

const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
/**
 * @type {import('webpack').WebpackOptionsNormalized}
 */
const prodConfig = {
  mode: 'production',
}

module.exports = webpackMerge.merge(baseConfig, prodConfig)
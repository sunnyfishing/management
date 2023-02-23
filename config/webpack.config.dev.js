// webpack 的开发环境配置

//   config/webpack.config.dev.js

const merge = require('webpack-merge')
const baseConfig = require('./webpack.config.base')
const path = require('path')

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}

const webpackConfigDev = {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    contentBase: resolve('../src'), //是静态资源所在的路径，比如我们的模板index.html所在的路径，默认为项目根目录
    historyApiFallback: true,
    hot: true,  // 热更新
    host: 'localhost',  
    open: true,   //服务启动后默认在浏览器打开
    port: 3001,   //打开的端口号
    proxy: {
      '/apiInterface/interface': {
        target: 'http://snzx-ht.kf315.net/',
        changeOrigin: true,
        pathRewrite: {
          // '/apiInterface/interface': ''
        }
      },
    }
  }
};


module.exports = merge(baseConfig, webpackConfigDev)


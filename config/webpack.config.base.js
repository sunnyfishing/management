// webpack 的基础配置
//  config/webpack.config.base.js
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')


/**
 * @type {import('webpack').Configuration}
 */

module.exports = {
  entry: {
    app: './src/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
  },
  module: {
    rules: [
      { test: /\.(js|jsx)$/, loader: 'babel-loader', exclude: /node_modules/ },
      { test: /\.(ts|tsx)$/, loader: 'ts-loader', exclude: /node_modules/ },
      {
        test: /\.(css|scss)$/,
        exclude: /\.module\.scss$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
      {
        test: /\.module\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                getLocalIdent: getCSSModuleLocalIdent,
              },
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      // webpack5 内置 assets 类型，我们不需要额外安装插件就可以进行图片等资源文件的解析
      {
        test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      // 如果想要把css单独打包出来——目前只有在webpack V4版本才支持使用该插件
      // {
      //   test: /\.css$/i,
      //   use: [MiniCssExtractPlugin.loader, 'css-loader'],
      // },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      title: '管理后台',
      template: path.resolve(__dirname, '../index.html'),
      filename: 'index.html',
    }),
    new CleanWebpackPlugin(),
    // 如果想要把css单独打包出来——目前只有在webpack V4版本才支持使用该插件
    // new MiniCssExtractPlugin({
    //   filename: 'css/[name].[hash].css',
    // })
  ],
  // webpack5 引入了缓存来提高二次构建速度，我们只需要在 webpack 配置文件中加入如下代码即可开启缓存
  cache: {
    type: 'filesystem',
    // 可选配置
    buildDependencies: {
      config: [__filename], // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
    },
    name: 'development-cache',
  },

}
// webpack 的基础配置
//  config/webpack.config.base.js
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent')
const Happypack = require('happypack');
const os = require('os');

const isDev = process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'development';

/**
 * @type {import('webpack').Configuration}
 */

// 启用最大核心共享线程进行打包，TODO: 注意低配电脑打包会有问题，如有问题，将happyThreadPool移出再试
const happyThreadPool = Happypack.ThreadPool({ size: os.cpus().length });

function resolve(relatedPath) {
  return path.join(__dirname, relatedPath);
}

module.exports = {
  entry: {
    app: './src/index.tsx',
  },
  devtool: 'source-map',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].[hash].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx','.json', '.scss'],
    alias: {  // 引用别名
      'Api': path.join(__dirname, '/../src/api'),
    },
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
      {
        test: /\.(jpe?g|png|gif|svg|woff|woff2|eot|ttf|otf)$/i,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: 'img/[name]_[hash:8][ext]'
        },
      },
      // 如果想要把css单独打包出来——目前只有在webpack V4版本才支持使用该插件
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      title: '三农在线管理后台',
      template: path.join(__dirname, '../index.html'),
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name]-test.css',	//控制从打包后的入口JS文件中提取CSS样式生成的CSS文件的名称
      chunkFilename: '[name]-test.css',	//控制从打包后的非入口JS文件中提取CSS样式生成的CSS文件的名称。
    }),
    new Happypack({
      id: 'jsx',
      threads: 4, // 代表开启几个子进程去处理这一类型的文件,默认3
      // 代表共享进程池，即多个 HappyPack 实例都使用同一个共享进程池中的子进程去处理任务，以防止资源占用过多。
      // 注意：低配置电脑打包的代码，可能会存在问题，之前招商银行PC端遇到过，慎用
      threadPool: happyThreadPool,
      verbose: true, // 此项配置会影响打包速度,默认为true
      loaders: [{
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-react', '@babel/preset-env'],
          plugins: [
            '@babel/plugin-syntax-dynamic-import',
            ['@babel/plugin-proposal-decorators', { 'legacy': true }],
            'transform-class-properties',
          ],
          cacheDirectory: true,
        },
        // exclude: /node_modules/,
        include: resolve('src'),
      }],
    }),
  ],

}
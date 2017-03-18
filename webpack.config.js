const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
const pkg = require('./package.json')

const DIR = 'demo'
const PORT = process.env.PORT || 8080
const docs = process.env.NODE_ENV === 'production'

const htmlWebpackPluginConfig = {
  title: `${pkg.name} | ${pkg.description}`,
  minify: { collapseWhitespace: true },
}

const entry = [
  'babel-polyfill',
  `./${DIR}/index.js`,
]

const plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    },
  }),
  new HtmlWebpackPlugin(docs ? Object.assign(htmlWebpackPluginConfig, { favicon: `${DIR}/favicon.ico` }) : htmlWebpackPluginConfig),
  new HtmlWebpackIncludeAssetsPlugin({
    assets: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css',
    append: false,
  }),
]

if (docs) {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({ compress: { warnings: false, screw_ie8: true } })
  )
} else {
  entry.unshift(
    `webpack-dev-server/client?http://localhost:${PORT}`,
    'webpack/hot/only-dev-server'
  )
  plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
}

module.exports = {
  plugins,
  entry,
  cache: true,
  output: {
    path: path.resolve(__dirname, DIR),
    filename: 'bundle.js',
  },
  resolve: {
    alias: {
      [pkg.name]: path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', { loader: 'css-loader', options: { minimize: true } }],
      },
    ],
  },
  devServer: {
    contentBase: `./${DIR}`,
    hot: true,
    publicPath: '/',
    host: '0.0.0.0',
    port: PORT,
  },
}

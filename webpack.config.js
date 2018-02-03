const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    filename: 'bundle.js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.css$/,
      exclude: /(node_modules)/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: 'css-loader'
      })
    }, {
      test: /\.(png|jpg|gif|svg)$/,
      exclude: /(node_modules)/,
      use: {
        loader: 'file-loader',
        options: {
          name: './assets/[name].[ext]'
        }
      }
    }]
  },
  plugins: [
    //new UglifyJsPlugin()
    new ExtractTextPlugin('bundle.css'),
    new HtmlWebpackPlugin({
      title: 'Products Grid',
      filename: 'index.html',
      template: './public/index.html'
    })
  ]
}

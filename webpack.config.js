const path = require('path')
const externals = require('webpack-node-externals')
const webpack = require('webpack')

module.exports = function(env) {
  return {
    entry: './src/lambda/index.js',
    output: {
      path: path.resolve(__dirname, './dist/src/lambda'),
      libraryTarget: 'commonjs2',
      filename: '[name].js'
    },
    stats: 'minimal',
    target: 'node',
    devtool: 'sourcemap',
    externals: {
      'aws-sdk': 'aws-sdk'
    },
    module: {
      rules: [
        { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ }
        // { test: /\.json$/, loader: 'json-loader' }
      ]
    },
    mode: 'none'
  }
}

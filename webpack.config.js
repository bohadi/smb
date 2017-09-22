const webpack = require('webpack');

module.exports = {
  entry: './src/scene.js',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {}
    ]
  },
  plugins: [
    //new webpack.optimize.UglifyJsPlugin(),
  ]
};

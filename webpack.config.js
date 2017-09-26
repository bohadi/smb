const webpack = require('webpack');

module.exports = {
  entry: './src/scene.js',
  output: {
    filename: 'bundle.js'
  },
  plugins: [
    //new webpack.optimize.UglifyJsPlugin(),
  ],
};

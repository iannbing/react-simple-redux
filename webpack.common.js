const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: { main: ['./src/index.tsx'] },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'ReactSimpleTreeMenu',
    libraryTarget: 'umd2',
    publicPath: '/dist/',
    umdNamedDefine: true,
    globalObject: `typeof self !== 'undefined' ? self : this`,
  },
  module: {
    rules: [
      {
        test: /\.(t|j)sx?$/,
        loader: 'awesome-typescript-loader',
        exclude: path.resolve(__dirname, 'node_modules/'),
        options: {
          silent: true,
          configFileName: './tsconfig.json',
          useBabel: true,
          babelCore: '@babel/core',
        },
      },
      { enforce: 'pre', test: /\.js$/, loader: 'source-map-loader' },
    ],
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['*', '.ts', '.tsx', '.js', '.jsx'],
    alias: {
      react: path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
      assets: path.resolve(__dirname, 'assets'),
    },
  },
  plugins: [new CleanWebpackPlugin()],
  externals: ['react', 'react-dom'],
};

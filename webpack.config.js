/* eslint-disable @typescript-eslint/no-var-requires, no-undef, import/no-extraneous-dependencies */
const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = [
  'source-map'
].map(devtool => ({
  devtool,
  mode: 'production',
  entry: './src/index.ts',
  context: __dirname, // to automatically find tsconfig.json
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'feather-ink-ts-utils.js',
    library: 'feather-ink-ts-utils',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true
            }
          }
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  plugins: [new ForkTsCheckerWebpackPlugin(), new ESLintPlugin()]
}))

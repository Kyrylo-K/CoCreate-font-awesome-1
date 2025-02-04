const path = require("path")
const TerserPlugin = require("terser-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
let isProduction = process.env.NODE_ENV === "production"
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
// const ExtractTextPlugin = require("extract-text-webpack-plugin")
const htmlWebpack = require('html-webpack-plugin');

module.exports = {
  entry: {
    "CoCreate-font-awesome": "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: isProduction ? "[name].min.js" : "[name].js",
    libraryTarget: "umd",
    libraryExport: "default",
    library: ["CoCreate", "font-awesome"],
    globalObject: "this",
    // publicPath: 'https://server.cocreate.app/CoCreateJS/dist/'
  },

  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
    new htmlWebpack()
  ],
  // Default mode for Webpack is production.
  // Depending on mode Webpack will apply different things
  // on final bundle. For now we don't need production's JavaScript
  // minifying and other thing so let's set mode to development
  mode: isProduction ? "production" : "development",
  module: {
    rules: [
      {
        test: /.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            plugins: ["@babel/plugin-transform-modules-commonjs"],
          },
        },
      },
      {
        test: /.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      // {
      //   test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[name].[ext]',
      //         outputPath: 'fonts/'
      //       }
      //     }
      //   ]
      // }

      // {
      //     test: /\.(svg|eot|woff|woff2|ttf)$/,
      //     use: ['file-loader']
      // }

      // {
      //     test: /\.(sass|scss|css)$/,
      //     use: ['style-loader','css-loader','sass-loader']
      // },
      {
          test: /\.(svg|eot|woff|woff2|ttf)$/,
          use: ['file-loader']
      }
    ],
  },

  // add source map
  ...(isProduction ? {} : { devtool: "eval-source-map" }),

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: true,
        // cache: true,
        parallel: true,
        // sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          // extractComments: 'all',
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "all",
      minSize: 200,
      // maxSize: 99999,
      //minChunks: 1,

      cacheGroups: {
        defaultVendors: false,
      },
    },
  },
}

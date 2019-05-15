const path = require("path");
const webpack = require("webpack");
const CleanPlugin = require("clean-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const workboxPlugin = require("workbox-webpack-plugin");

const DIST = path.join(__dirname, "dist");

module.exports = {
  mode: "development",// production
  entry: "./js/index.js",
  output: {
    filename: "index.[chunkhash:5].js",
    path: DIST
  },
  devtool: 'cheap-module-source-map',
  // optimization: {
  //   minimize: false
  // },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: ["file-loader"]
      }
    ]
  },
  plugins: [
    new CleanPlugin([DIST]),
    new HtmlPlugin({
      filename: "index.html",
      template: "index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[chunkhash:5].css"
    }),
    /**
     * Workbox Webpack Plugin
     */
    new workboxPlugin.GenerateSW({
      swDest: "sw.js", // 确保名称一致 navigator.serviceWorker.register
      importWorkboxFrom: "local", // workbox-sw.js 部署本地服务器
      cacheId: "arnoo",
      // 以下文件不会在`预缓存`中(arnoo-precache-v2)
      exclude: [/\.map$/, /\.html$/], // 修改index.html, 再运行 npm run build
      // `运行时缓存`(arnoo-runtime)
      // https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.strategies#methods
      runtimeCaching: [
        {
          urlPattern: /(\/$|index\.html)/, // 注意: index.html一定是网络优先, 如果此文件被缓存, 之后就没法更新了.
          handler: "networkFirst", // 网络优先, 如果离线, 则用缓存.
          options: {
            // Fall back to the cache after 2 seconds.
            networkTimeoutSeconds: 2,
          }
        },
        // 因为我们是根据hash生成文件名, 不可能重复, 所以不需要在运行时缓存
        // {
        //   urlPattern: /\.(js|css|png|jpg|gif|svg)/,
        //   handler: "staleWhileRevalidate" // 缓存和网络并行; 如果缓存可用, 先用缓存, 否则等待网络返回; 缓存会随着每次成功请求的网络响应而更新。
        // }
      ]
    })
  ]
};

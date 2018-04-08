import * as HtmlWebpackPlugin from "html-webpack-plugin"
import { join } from "path"
import HtmlWebpackDynamicEnvPlugin from "../../src/plugin"
import { Configuration } from "webpack"

const webpackMajorVersion = require("webpack/package.json").version.split('.')[0]

const config: Configuration = {
  context: __dirname,
  entry: "./example.js",
  output: {
    path: join(__dirname, "dist/webpack-" + webpackMajorVersion),
    publicPath: "",
    filename: "bundle.js"
  },
  plugins: [
    new HtmlWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: "second.html",
      template: "./second-template.html"
    }),
    new HtmlWebpackPlugin({
      filename: "subfolder/without-environments.html"
    }),
    new HtmlWebpackDynamicEnvPlugin({
      envVars: {
        API_ENDPOINT: process.env.DEFAULT_API || "https://api.github.com",
        FEATURE_FLAG: "true"
      },
      templateFileNames: {
        "index.html": "index.tmpl",
        "second.html": "subfolder/second.tmpl"
      },
      injectEnvVars: require("./inject-variables"),
      windowKeyName: "config",
      configFileName: "cv.sh"
    })
  ]
}

export default config
module.exports = config
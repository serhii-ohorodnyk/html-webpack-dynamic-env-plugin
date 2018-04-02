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
    new HtmlWebpackDynamicEnvPlugin({
      envVars: {
        API_ENDPOINT: "https://your.api.endpoint.com",
        FEATURE_FLAG: "true"
      }
    })
  ]
}

export default config
module.exports = config
import { toPairs, isEmpty, forEach, pipe } from "ramda"
import { defaultOptions, Options } from "./options"
import {
  envsToPlaceholderValues,
  envsToStringDefaultValues,
  rawEnvToScriptTag
} from "./envTransformations"
import getConfigFunction from "./configFunctions"
import { Compiler, compilation } from "webpack"

interface HtmlPluginData {
  html: string
  outputName: string
}

type Callback = (e?: any, result?: any) => void

class HtmlWebpackDynamicEnvPlugin {
  // Options
  options: Required<Options>

  // Outputs
  private templates: { [key: string]: string } = { }

  constructor(options: Options) {
    if (isEmpty(options.envVars))
      throw "'envVars' should not be empty!"

    this.options = {
      ...defaultOptions,
      ...options
    }
  }

  apply(compiler: Compiler) {
    if (compiler.hooks) {
      // webpack 4 support
      compiler.hooks.compilation.tap("HtmlWebpackDynamicEnvPluginOnCompilation", compilation =>
        (compilation.hooks as any).htmlWebpackPluginAfterHtmlProcessing.tapAsync(
          "HtmlWebpackDynamicEnvPluginOnCompilation",
          this.afterHtmlProcessing
        )
      )
      compiler.hooks.emit.tap("HtmlWebpackDynamicEnvPluginOnEmit", this.onEmit)
    } else {
      compiler.plugin("compilation", compilation => 
        compilation.plugin(
          "html-webpack-plugin-after-html-processing",
          this.afterHtmlProcessing
        )
      )
      compiler.plugin("emit", this.onEmit)
    }
  }

  private afterHtmlProcessing = (htmlPluginData: HtmlPluginData, callback: Callback) => {
    const templateOptions =
      rawEnvToScriptTag(envsToPlaceholderValues(this.options.envVars), this.options.windowKeyName)

    this.templates[htmlPluginData.outputName] =
      this.options.injectEnvVars(htmlPluginData.html, templateOptions)

    const defaultOptions =
      rawEnvToScriptTag(envsToStringDefaultValues(this.options.envVars), this.options.windowKeyName)

    htmlPluginData.html = this.options.injectEnvVars(htmlPluginData.html, defaultOptions)

    callback(null, htmlPluginData)
  }

  private onEmit = (compilation: compilation.Compilation, cb: Callback) => {
    const configScript = getConfigFunction(this.options.configFactoryFunc)(
      this.options.envVars
    )
    
    compilation.assets[this.options.configFileName] = {
      source: () => configScript,
      size: () => configScript.length
    }

    pipe<{ [key: string]: string }, string[][], void>(
      toPairs,
      forEach(template => {
        const templateName = this.options.templateFileNames[template[0]] || `${template[0]}.template`
        compilation.assets[templateName] = {
          source: () => template[1],
          size: () => template[1].length
        }
      })
    )(this.templates)

    cb && cb()
  }
}

export default HtmlWebpackDynamicEnvPlugin
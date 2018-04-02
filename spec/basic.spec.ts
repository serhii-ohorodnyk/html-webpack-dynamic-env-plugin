import * as webpack from "webpack"
import * as rimraf from "rimraf"
import { join } from "path"
import * as HtmlWebpackPlugin from "html-webpack-plugin"
import HtmlWebpackDynamicEnvPlugin from "../src/plugin"
import { Configuration, compilation } from "webpack"
import { readFileSync, existsSync } from "fs"
import { forEach } from "ramda"
import { defaultOptions } from "../src/options"
import getConfigFunction from "../src/configFunctions";
import { toPlaceholder } from "../src/envTransformations";

jest.setTimeout(30000)
const webpackMajorVersion = require("webpack/package.json").version.split(".")[0]
const OUTPUT_DIR = join(
  __dirname,
  "../dist-tests",
  "basic",
  `webpack-${webpackMajorVersion}`
)

interface ExpectedResult {
  filename: string
  rules: Array<string | RegExp>
}
type ExpectedResults = Array<string | ExpectedResult>
interface TestPluginData {
  config: Configuration
  expectedResults: ExpectedResults
  expectBundleErrors?: boolean
  expectCompilationErrors?: boolean
  expectCompilationWarnings?: boolean
}

const testPlugin = ({
  config,
  expectedResults,
  expectBundleErrors = false,
  expectCompilationErrors = false,
  expectCompilationWarnings = false
}: TestPluginData) => (done: jest.DoneCallback) => {

  if (webpackMajorVersion >= 4) {
    config.mode = "development"
    config.optimization = { minimizer: [] }
    if (config.module && (config.module as any).loaders) {
      config.module.rules = (config.module as any).loaders
      delete (config.module as any).loaders
    }
  }

  webpack(config, (err, stats) => {
    if (expectBundleErrors) {
      expect(err).not.toBeFalsy()
    } else {
      expect(err).toBeFalsy()
      checkCompilation((stats as any).compilation, err, expectCompilationErrors, expectCompilationWarnings)

      forEach(expectedResult => {
        if (typeof expectedResult === "string") {
          expect(existsSync(join(OUTPUT_DIR, expectedResult))).toBe(true)    
        } else {
          const checkContent = checkContentInFile(join(OUTPUT_DIR, expectedResult.filename))
          forEach(checkContent, expectedResult.rules)
        }
      }, expectedResults)
    }

    done()
  })
}

const checkCompilation = (
  compilation: compilation.Compilation,
  err: Error,
  expectErrors: boolean,
  expectWarnings: boolean
) => {
  const compilationErrors = (compilation.errors || []).join("\n")
  if (expectErrors) {
    expect(compilationErrors).not.toBe("")
  } else {
    expect(compilationErrors).toBe("")
  }
  const compilationWarnings = (compilation.warnings || []).join("\n")
  if (expectWarnings) {
    expect(compilationWarnings).not.toBe("")
  } else {
    expect(compilationWarnings).toBe("")
  }
}

const checkContentInFile = (filepath: string) => {
  const content = readFileSync(filepath).toString()
  return (result: string | RegExp) => {
    if (result instanceof RegExp) {
      expect(content).toMatch(result)
    } else {
      expect(content).toContain(result)
    }
  }
}

const baseConfig = {
  entry: join(__dirname, 'fixtures/index.js'),
  output: {
    path: OUTPUT_DIR,
    filename: 'index_bundle.js'
  },
}

describe("HtmlWebpackDynamicEnvPlugin", () => {
  beforeEach(() => rimraf.sync(OUTPUT_DIR))

  it("generates default files and values in default configuration", testPlugin({
    config: {
      ...baseConfig,
      plugins: [
        new HtmlWebpackPlugin(),
        new HtmlWebpackDynamicEnvPlugin({
          envVars: { ENV_VAR: "env-var-value" }
        })
      ]
    }, 
    expectedResults: [{ 
      filename: defaultOptions.configFileName, 
      rules: [getConfigFunction(defaultOptions.configFactoryFunc)({ ENV_VAR: "env-var-value" })]
    }, { 
      filename: "index.html",
      rules: [defaultOptions.windowKeyName, "ENV_VAR", "env-var-value"]
    }, {
      filename: "index.html.template",
      rules: [defaultOptions.windowKeyName, toPlaceholder("ENV_VAR")]
    }]
  }))
  
  it("allows you to specify custom 'configFileName' with subfolders", testPlugin({
    config: {
      ...baseConfig,
      plugins: [
        new HtmlWebpackPlugin(),
        new HtmlWebpackDynamicEnvPlugin({
          configFileName: "subfolder/custom-config-name.sh",
          envVars: { ENV_VAR: "env-var-value" }
        })
      ]
    },
    expectedResults: [
      "subfolder/custom-config-name.sh"
    ]
  }))
  
  it("allows you to specify custom 'windowKeyName'", testPlugin({
    config: {
      ...baseConfig,
      plugins: [
        new HtmlWebpackPlugin(),
        new HtmlWebpackDynamicEnvPlugin({
          envVars: { ENV_VAR: "envVarValue"},
          windowKeyName: "differentWindowKey"
        })
      ]
    },
    expectedResults: [{
      filename: "index.html", rules: ["window.differentWindowKey"],
    }, {
      filename: "index.html.template", rules: ["window.differentWindowKey"]
    }]
  }))

  it("allows you to specify custom 'injectEnvVars'", testPlugin({
    config: {
      ...baseConfig,
      plugins: [
        new HtmlWebpackPlugin(),
        new HtmlWebpackDynamicEnvPlugin({
          envVars: { LOREM: "ipsum" },
          injectEnvVars: (html, vars) => `${html}${vars}custom-text-in-the-end`
        })
      ]
    },
    expectedResults: [{
      filename: "index.html", rules: ["custom-text-in-the-end"],
    }, {
      filename: "index.html.template", rules: ["custom-text-in-the-end"]
    }]
  }))

  it("allows you to specify custom 'configFactoryFunc'", testPlugin({
    config: {
      ...baseConfig,
      plugins: [
        new HtmlWebpackPlugin(),
        new HtmlWebpackDynamicEnvPlugin({
          envVars: { LOREM: "ipsum"},
          configFactoryFunc: envs => `custom-config-template ${JSON.stringify(envs)}`
        })
      ]
    },
    expectedResults: [{
      filename: defaultOptions.configFileName,
      rules: ["custom-config-template", "LOREM", "ipsum"]
    }]
  }))

  it("should throw an exception when unsupported 'configFactoryFunc' is provided", testPlugin({
    config: {
      ...baseConfig,
      plugins: [
        new HtmlWebpackPlugin(),
        new HtmlWebpackDynamicEnvPlugin({
          envVars: { LOREM: "ipsum"},
          configFactoryFunc: "unsupportedType"
        } as any)
      ]
    },
    expectedResults: [],
    expectBundleErrors: true
  }))

  it("allows you to specify custom 'templateFileNames' with subfolders")

  it("generates templates for every html with multi-entry setup in HtmlWebpackPlugin")
  it("generates one script file with multi-entry setup in HtmlWebpackPlugin")
  it("allow you to specify custom 'templateFileNames' when HtmlWebpackPlugin has multiple html entries")
  it("does not work without HtmlWebpackPlugin")
  it("does not work if plugin specified before HtmlWebpackPlugin")
  it("throws an exception when 'envVars' are not specified")
})
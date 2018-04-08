import * as webpack from "webpack"
import { join, resolve } from "path"
import { readFileSync } from "fs"
import * as rimraf from "rimraf"

jest.setTimeout(30000)
const webpackMajorVersion = require("webpack/package.json").version.split(".")[0]
const OUTPUT_DIR = join(
  __dirname,
  "../dist-tests",
  "examples",
  `webpack-${webpackMajorVersion}`
)

type DoneCallback = () => void

const runExample = (exampleName: string) => (done: DoneCallback) => {
  const examplePath = resolve(__dirname, "..", "examples", exampleName)
  const exampleOutput = join(OUTPUT_DIR, exampleName)
  const fixturePath = join(examplePath, "dist", "webpack-" + webpackMajorVersion)

  const config = require(join(examplePath, "webpack.config.ts"))
  console.log(JSON.stringify(config))
  // config.context = examplePath
  // config.output.path = exampleOutput

  if (Number(webpackMajorVersion) >= 4) {
    config.plugins = [
      ...config.plugins,
      new webpack.LoaderOptionsPlugin({
        options: {
          context: process.cwd()
        }
      })
    ]
    config.mode = "production"
    config.optimization = { minimizer: [] }
  }

  webpack(config, (err, stats) => {
    expect(err).toBeFalsy()
    const compilationErrors = ((stats as any).compilation.errors || []).join("\n")
    expect(compilationErrors).toBe("")
    const compilationWarnings = ((stats as any).compilation.warnings || []).join("\n")
    expect(compilationWarnings).toBe("")

    const dirCompare = require("dir-compare")
    const res = dirCompare.compareSync(fixturePath, exampleOutput, { compareSize: true })
    res.diffSet.filter((diff) => diff.state === "distinct")
      .forEach(diff => {
        const file1Contents = readFileSync(join(diff.path1, diff.name1)).toString()
        const file2Contents = readFileSync(join(diff.path2, diff.name2)).toString()
        expect(file1Contents).toBe(file2Contents)
      })

    expect(err).toBeFalsy()
    expect(res.same).toBe(true)
    done()
  })
}

describe("HtmlWebpackDynamicEnvPlugin examples", () => {
  beforeAll(() =>  rimraf.sync(OUTPUT_DIR))
  
  it("default example", runExample("default"))
  it("customized example", runExample("customized"))
})
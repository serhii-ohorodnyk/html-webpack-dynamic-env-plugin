import { reduce, pipe, toPairs } from "ramda"
import { Options } from "../options"

const envsToScriptReplacements = pipe<Options["envVars"], Array<(string | undefined)[]>, string>(
  toPairs,
  reduce<(string | undefined)[], string>(
    (acc, value) => `${acc}s/%${value[0]}%/"'\${${value[0]}-${value[1]}}'"/g;`,
    ""
  )
)

export default (envs: Options["envVars"]) => {
  const rawEnvs = envsToScriptReplacements(envs)

  return `
fromFile=\${1}
toFile=\${2}

sed -e '${rawEnvs}' $fromFile > $toFile
`
}
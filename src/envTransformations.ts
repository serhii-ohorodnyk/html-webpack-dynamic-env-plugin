import { reduce, pipe, toPairs } from "ramda"
import { Options } from "./options"

const extractValue = (value: string | undefined) =>
  value !== undefined && value !== null ? `'${value}'` : ''

export const toPlaceholder = value => `%${value}%`

export const envsToStringDefaultValues = pipe<Options["envVars"], Array<(string | undefined)[]>, string>(
  toPairs,
  reduce<(string | undefined)[], string>(
    (acc, value) => `${acc}${value[0]}:${extractValue(value[1])},`,
    ""
  )
)
  
export const envsToPlaceholderValues = pipe<Options["envVars"], Array<(string | undefined)[]>, string>(
  toPairs,
  reduce<(string | undefined)[], string>(
    (acc, value) => `${acc}${value[0]}:${toPlaceholder(value[0])},`,
    ""
  )
)

export const rawEnvToScriptTag = (rawEnvs: string, windowKeyName: string) =>
  `<script>window.${windowKeyName}={${rawEnvs}}</script>`
import { default as shell } from "./shell"

export default (configFactoryFunc: "shell" | typeof shell) => {
  switch (configFactoryFunc) {
    case "shell":
      return shell
    default:
      return configFactoryFunc
  }
}
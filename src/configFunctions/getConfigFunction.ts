import { default as shell } from "./shell"

export default (configFactoryFunc: "shell" | typeof shell) => {
  switch (configFactoryFunc) {
    case "shell":
      return shell
    default:
    if (typeof configFactoryFunc === "function") {
      return configFactoryFunc
    } else {
      throw "'configFactoryFunc' should be either predefined function factory or a custom function!"
    }
  }
}
declare namespace jasmine {
  interface Matchers<T> {
    diffPatch: (to: string) => boolean
  }
}

declare var jest: {
  setTimeout: (number) => void
}
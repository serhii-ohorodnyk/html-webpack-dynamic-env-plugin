declare namespace jasmine {
  interface Matchers<T> {
    diffPatch: (to: string) => boolean
  }
}
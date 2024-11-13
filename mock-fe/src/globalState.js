class GlobalState {
  constructor() {
    this.version = ''
  }

  setVersion(version) {
    this.version = version
  }
  getVersion() {
    return this.version
  }
}

const globalState = new GlobalState()
export default globalState
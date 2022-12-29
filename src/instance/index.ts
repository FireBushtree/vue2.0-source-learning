import { initMixin } from "./init"

interface Options {
  el?: string,
  data?: () => object
}

function Vue(options: Options) {
  this.$options = options
  this._init()
}

initMixin(Vue)

export default Vue

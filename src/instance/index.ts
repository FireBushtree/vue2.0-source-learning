import { initMixin } from "./init"
import { initRender } from "./render"

interface Options {
  el?: string,
  data?: () => object
}

function Vue(options: Options) {
  this.$options = options
  this._init()
}
initRender(Vue)
initMixin(Vue)

export default Vue

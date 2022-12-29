import { initState } from "./state"

export function initMixin(Vue: any) {
  Vue.prototype._init = function() {
    const vm = this
    initState()

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}
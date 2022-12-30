import { Component } from '@/types/component'
import { initState } from './state'

export function initMixin(Vue: typeof Component) {
  Vue.prototype._init = function () {
    const vm: Component = this
    initState(vm)

    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
}

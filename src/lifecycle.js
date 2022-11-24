import { createElementVNode, createTextVNode } from "./vdom/index"

export function initLifyCycle(Vue) {
  Vue.prototype._update = function(vnode) {
    console.log('update', vnode)
  }

  Vue.prototype._c = function() {
    return createElementVNode(this, ...arguments)
  }

  Vue.prototype._v = function() {
    return createTextVNode(this, ...arguments)
  }

  Vue.prototype._s = function(value) {
    return JSON.stringify(value)
  }

  Vue.prototype._render = function() {
    const vm = this
    return vm.$options.render.call(vm)
  }
}

export function mountComponent(vm, el) {
  vm._update(vm._render())
}
import { Watcher } from './observe/watcher'
import { createElementVNode, createTextVNode } from './vdom/index'
import { patch } from './vdom/patch'

export function initLifyCycle(Vue) {
  Vue.prototype._update = function (vnode) {
    const vm = this
    const el = vm.$el
    vm.$el = patch(el, vnode)
  }

  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments)
  }

  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments)
  }

  Vue.prototype._s = function (value) {
    return typeof value === 'string' ? value : JSON.stringify(value)
  }

  Vue.prototype._render = function () {
    const vm = this
    return vm.$options.render.call(vm)
  }
}

export function mountComponent(vm, el) {
  vm.$el = el

  const updateComponent = () => vm._update(vm._render())

  new Watcher(vm, updateComponent, true)
}

export function callhook(vm, hook) {
  const handlers = vm.$options[hook]

  if (handlers) {
    handlers.forEach(item => item.call(vm))
  }
}

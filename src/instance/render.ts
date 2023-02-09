import { compileToFunction } from '@/compiler'
import { Component } from '@/types/component'
import { createElement } from '@/vdom/create-element'
import { patch } from '@/vdom/patch'
import VNode from '@/vdom/vnode'
import { query } from '../util'
import { installRenderHelpers } from './render-helpers'

export function initRender(Vue: typeof Component) {}

export function renderMixin(Vue: typeof Component) {
  installRenderHelpers(Vue.prototype)

  Vue.prototype._c = createElement

  Vue.prototype._render = function () {
    const { render } = this.$options
    const result = render.call(this)
    return result
  }

  Vue.prototype._update = function(vnode: VNode) {
    const vm: Component = this
    const preVNode = vm._vnode
    if (!preVNode) {
      patch(vm.$el, vnode)
      document.body.appendChild(vnode.elm)
    }

  }

  Vue.prototype.$mount = function (el: string | Element) {
    if (!el) {
      return
    }

    const node = query(el)
    this.$el = node
    const template = node.outerHTML
    const compiled = compileToFunction(template)
    this.$options.render = new Function(compiled.render)
    this._update(this._render())
  }
}

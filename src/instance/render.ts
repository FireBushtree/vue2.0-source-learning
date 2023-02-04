import { compileToFunction } from '@/compiler'
import { Component } from '@/types/component'
import VNode from '@/vdom/vnode'
import { query } from '../util'
import { installRenderHelpers } from './render-helpers'

export function initRender(Vue: typeof Component) {}

export function renderMixin(Vue: typeof Component) {
  installRenderHelpers(Vue.prototype)

  Vue.prototype._render = function () {
    const { render } = this.$options
    const node = new VNode()

    return node
  }

  Vue.prototype.$mount = function (el: string | Element) {
    if (!el) {
      return
    }

    const node = query(el)
    const template = node.outerHTML
    const compiled = compileToFunction(template)
    this.$options.$render = compiled.render
  }
}

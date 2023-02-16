import { compileToFunction } from '@/compiler'
import Watcher from '@/observer/watcher'
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

      if (vm.$el) {
        document.body.insertBefore(vnode.elm, vm.$el)
        document.body.removeChild(vnode.elm.nextSibling)
        vm.$el = vnode.elm
      }
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

    const updateComponent = () => {
      this._update(this._render())
    }

    const watcher = new Watcher(this, updateComponent, true)
    console.log(watcher)
  }
}

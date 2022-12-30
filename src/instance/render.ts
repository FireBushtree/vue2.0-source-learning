import { compileToFunction } from "@/compiler"
import { Component } from "@/types/component"
import { query } from "../util"

export function initRender(Vue: typeof Component) {
  Vue.prototype.$mount = function (el: string | Element) {
    if (!el) {
      return
    }

    const node = query(el)
    const template = node.outerHTML
    const render = compileToFunction(template)
  }
}

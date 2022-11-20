import { compileToFunction } from "./compiler/index";
import { initState } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = options

    initState(vm)

    if (options.el) {
      vm.$mount(options.el)
    }
  };

  Vue.prototype.$mount = function(el) {
    const vm = this
    el = document.querySelector(el)
    const ops = vm.$options

    let template

    // 暂时不支持 ops.template 提供模板
    if (el) {
      template = el.outerHTML
    }

    if (template) {
      const render = compileToFunction(template)
      ops.render = render
    }
  }
}

import { compileToFunction } from "./compiler/index";
import { callhook, mountComponent } from "./lifecycle";
import { initState } from "./state";
import { mergeOptions } from "./utils";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const vm = this
    vm.$options = mergeOptions(this.constructor.options, options)

    callhook(vm, 'beforeCreate')
    initState(vm)
    callhook(vm, 'created')

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

    mountComponent(vm, el)
  }
}

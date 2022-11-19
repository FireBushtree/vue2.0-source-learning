import { initState } from "./state";

export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    const ctx = this
    ctx.$options = options

    initState(ctx)
  };
}

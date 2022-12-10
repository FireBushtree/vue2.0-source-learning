import {
  Watcher
} from './observe/watcher'
import { initGlobalApi } from "./global-api";
import { initMixin } from "./init";
import { initLifyCycle } from "./lifecycle";

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
initLifyCycle(Vue)
initGlobalApi(Vue)

Vue.prototype.$watch = function(expOrFn, cb, options) {
  new Watcher(this, expOrFn, { user: true }, cb)
}

export default Vue;

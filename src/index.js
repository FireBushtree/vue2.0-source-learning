import { initGlobalApi } from "./global-api";
import { initMixin } from "./init";
import { initLifyCycle } from "./lifecycle";
import { initStateMixin } from './state';

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
initLifyCycle(Vue)
initGlobalApi(Vue)
initStateMixin(Vue)

export default Vue;

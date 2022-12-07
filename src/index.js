import { initGlobalApi } from "./global-api";
import { initMixin } from "./init";
import { initLifyCycle } from "./lifecycle";

function Vue(options) {
  this._init(options);
}

initMixin(Vue);
initLifyCycle(Vue)
initGlobalApi(Vue)

export default Vue;

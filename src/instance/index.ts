import { Options } from '../types/component'
import { GlobalAPI } from '../types/global-api'
import { initMixin } from './init'
import { initRender, renderMixin } from './render'

function Vue(options?: Options) {
  this.$options = options || {}
  this._init()
}

initRender(Vue)
initMixin(Vue)
renderMixin(Vue)

export default (Vue as unknown) as GlobalAPI

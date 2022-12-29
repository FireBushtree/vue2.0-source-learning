import { observe } from "../observer"
import { isFunction } from "../util"

export function initState(vm) {
  if (vm.$options.data) {
    initData(vm)
  }
}

export function initData(vm) {
  let data = vm.$options.data
  data = vm._data = isFunction(data) ? getData(vm, data) : data
  // 1. proxy data
  // 2. observe data
  observe(data)
}

export function getData(vm, data) {
  return data.call(vm)
}

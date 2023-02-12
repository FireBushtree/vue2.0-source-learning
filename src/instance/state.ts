import { observe } from '../observer'
import { Component } from '../types/component'
import { isFunction } from '../util'

export function proxy(target: Object, sourceKey: string, key: string) {
  Object.defineProperty(target, key, {
    configurable: true,
    enumerable: true,
    get() {
      return this[sourceKey][key]
    },
    set(newVal) {
      this[sourceKey][key] = newVal
    },
  })
}

export function initState(vm: Component) {
  if (vm.$options.data) {
    initData(vm)
  }
}

export function initData(vm: Component) {
  let data = vm.$options.data as Object
  data = vm._data = isFunction(data) ? getData(vm, data as Function) : data
  // 1. proxy data
  // 2. observe data
  observe(data)

  Object.keys(data).forEach(key => {
    proxy(vm, '_data', key)
  })
}

export function getData(vm: Component, data: Function) {
  return data.call(vm)
}

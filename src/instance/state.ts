import { observe } from '../observer'
import { Component } from '../types/component'
import { isFunction } from '../util'

export function initState(vm: Component) {
  if (vm.$options.data) {
    initData(vm)
  }
}

export function initData(vm: Component) {
  let data = vm.$options.data
  data = vm._data = isFunction(data) ? getData(vm, data as Function) : data
  // 1. proxy data
  // 2. observe data
  observe(data)
}

export function getData(vm: Component, data: Function) {
  return data.call(vm)
}

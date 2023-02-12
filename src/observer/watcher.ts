import { Component } from "@/types/component"
import { popTarget, pushTarget } from "./dep"

let id = 0

export default class Watcher {
  id: number
  getter: Function
  vm: Component
  value: any

  constructor(vm: Component, expOrFn: Function, isRenderWatcher?: boolean, cb?: Function) {
    this.id = id++
    this.getter = expOrFn
    this.vm = vm

    this.value = this.get()
  }

  get() {
    pushTarget(this)
    const val = this.getter.call(this.vm, this.vm)
    popTarget()
    return val
  }
}

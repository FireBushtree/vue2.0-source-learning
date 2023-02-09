import { Component } from "@/types/component"

let id = 0

export default class Watcher {
  id: number
  getter: Function
  vm: Component

  constructor(vm: Component, expOrFn: string, cb: Function) {
    this.id = id++
    this.getter = cb
    this.vm = vm
  }

  get() {
    const val = this.getter.call(this.vm, this.vm)
  }
}

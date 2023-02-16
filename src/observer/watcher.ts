import { Component } from "@/types/component"
import Dep, { popTarget, pushTarget } from "./dep"

let id = 0

export default class Watcher {
  id: number
  getter: Function
  vm: Component
  value: any
  deps: Dep[]
  newDepIds: Set<number>

  constructor(vm: Component, expOrFn: Function, isRenderWatcher?: boolean, cb?: Function) {
    this.id = id++
    this.getter = expOrFn
    this.vm = vm
    this.deps = []
    this.newDepIds = new Set()
    this.value = this.get()
  }

  addDep(dep: Dep) {
    if (!this.newDepIds.has(dep.id)) {
      this.deps.push(dep)
      this.newDepIds.add(dep.id)
      dep.addSub(this)
    }
  }

  update() {
    this.get()
  }

  get() {
    pushTarget(this)
    const val = this.getter.call(this.vm, this.vm)
    popTarget()
    return val
  }
}

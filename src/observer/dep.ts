import Watcher from './watcher'
let id = 0

export default class Dep {
  static target: null | Watcher
  id: number
  subs: Array<Watcher>

  constructor() {
    this.id = id++
    this.subs = []
  }

  depend() {
    Dep.target && this.subs.push(Dep.target)
  }
}

Dep.target = null
const targetStack: Array<Watcher> = []

export function pushTarget(target: Watcher) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

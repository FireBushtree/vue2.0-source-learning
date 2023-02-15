import Watcher from './watcher'
let id = 0

export default class Dep {
  static target: null | Watcher
  id: number
  subs: Array<Watcher>
  subMap: Map<number, Watcher>

  constructor() {
    this.id = id++
    this.subs = []
    this.subMap = new Map<number, Watcher>()
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  addSub(sub: Watcher) {
    this.subs.push(sub)
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

import { Dep } from "./dep"

let id = 0

export class Watcher {
  constructor(vm, callback, isRenderWatcher) {
    this.id = id ++
    this.isRenderWatcher = isRenderWatcher
    this.getter = callback
    this.deps = []
    this.depSet = new Set()

    this.get()
  }

  update() {
    queueWatcher(this)
  }

  addDep(dep) {
    if (this.depSet.has(dep.id)) {
      return
    }

    this.deps.push(dep)
    this.depSet.add(dep.id)
    dep.addSub(this)
  }

  get() {
    Dep.target = this
    this.getter()
    Dep.target = null
  }

  run() {
    console.log('run')
    this.get()
  }
}

let watcherQueue = []
let has = {}
let pending = false

function flushWatcherQueue() {
  const copyedQueue = [...watcherQueue]
  watcherQueue = []
  has = {}
  pending = false

  copyedQueue.forEach(item => {
    item.run()
  })
}

function queueWatcher(watcher) {
  const { id } = watcher

  if (has[id]) {
    return
  }

  watcherQueue.push(watcher)
  has[id] = watcher

  if (!pending) {
    pending = true
    setTimeout(flushWatcherQueue)
  }
}

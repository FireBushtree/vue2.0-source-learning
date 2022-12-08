import { popTarget, pushTarget } from "./dep"

let id = 0

export class Watcher {
  constructor(vm, callback, options) {
    this.id = id ++
    this.lazy = options.lazy
    this.dirty = this.lazy
    // this.isRenderWatcher = isRenderWatcher
    this.getter = callback
    this.deps = []
    this.depSet = new Set()

    this.lazy ? null : this.get()
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
    pushTarget(this)
    this.getter()
    popTarget()
  }

  run() {
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
    nextTick(flushWatcherQueue)
  }
}

let callbackList = []
let waiting = false

function flushCallbackList() {
  const copyedCallbackList = [...callbackList]
  callbackList = []
  waiting = false
  copyedCallbackList.forEach(item => item())

}

export function nextTick(callback) {
  callbackList.push(callback)

  if (!waiting) {
    timerFunc()
    waiting = true
  }
}

let timerFunc

if (Promise) {
  timerFunc = () => {
    Promise.resolve().then(flushCallbackList)
  }
} else if(MutationObserver) {
  const observer = new MutationObserver(flushCallbackList)
  const textNode = document.createTextNode(1)
  observer.observe(textNode, {
    characterData: true
  })
  timerFunc = () => {
    textNode.textContent = 2
  }
} else if (setTimeout) {
  timerFunc = () => {
    setTimeout(flushCallbackList)
  }
}

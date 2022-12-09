import { popTarget, pushTarget } from "./dep"

let id = 0

export class Watcher {
  constructor(vm, callback, options) {
    this.id = id ++
    this.lazy = options.lazy
    this.dirty = this.lazy
    // this.isRenderWatcher = isRenderWatcher
    this.vm = vm
    this.getter = callback
    this.deps = []
    this.depSet = new Set()
    this.value = undefined

    this.lazy ? null : this.get()
  }

  update() {
    if (this.lazy) {
      this.dirty = true
    } else {
      queueWatcher(this)
    }
  }

  depend() {
    let i = this.deps.length
    while(i--) {
      this.deps[i].depend()
    }
  }

  addDep(dep) {
    if (this.depSet.has(dep.id)) {
      return
    }

    this.deps.push(dep)
    this.depSet.add(dep.id)
    dep.addSub(this)
  }

  evaluate() {
    this.value = this.get()
    this.dirty = false
  }

  get() {
    pushTarget(this)
    const value = this.getter.call(this.vm)
    popTarget()

    return value
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

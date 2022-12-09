import { Dep } from "./observe/dep"
import observe from "./observe/index"
import { Watcher } from "./observe/watcher"

export function initState(vm) {
  const options = vm.$options

  if (options.data) {
    initData(vm)
  }

  if (options.computed) {
    initComputed(vm)
  }
}

function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    enumerable: true,
    configurable: true,

    get() {
      return vm[target][key]
    },

    set(newVal) {
      vm[target][key] = newVal
    }
  })
}

function initData(vm) {
  let data = vm.$options.data
  data = typeof data === 'function' ? data.call(vm) : data

  observe(data)

  vm._data = data

  for (let key in data) {
    proxy(vm, '_data', key)
  }
}

function initComputed(vm) {
  const { computed } = vm.$options
  const watchers = vm._watcherList = {}
  for (let key in computed) {
    const userDef = computed[key]
    const fn = typeof userDef === 'function' ? userDef : userDef.get
    watchers[key] = new Watcher(vm, fn, { lazy: true })
    defineComputed(vm, key, userDef)
  }
}

function createComputedGetter(key) {
  return function() {
    const watcher = this._watcherList[key]

    if (watcher.dirty) {
      watcher.evaluate()
    }

    if (Dep.target) {
      watcher.depend()
    }

    return watcher.value
  }
}

function defineComputed(target, key, userDef) {
  const setter = userDef.set || (() => {})
  Object.defineProperty(target, key, {
    get: createComputedGetter(key),
    set: setter
  })
}

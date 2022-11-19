import observe from "./observe/index"

export function initState(vm) {
  const options = vm.$options

  if (options.data) {
    initData(vm)
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
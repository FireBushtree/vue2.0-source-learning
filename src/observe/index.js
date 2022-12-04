import { newArrayProto } from './array'
import { Dep } from './dep'

class Observer {
  constructor(data) {
    data.__ob__ = this
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false,
    })

    if (Array.isArray(data)) {
      data.__proto__ = newArrayProto
      this.observeArray(data)
      return
    }

    this.walk(data)
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      defineReactive(data, key, data[key])
    })
  }

  observeArray(data) {
    data.forEach((item) => observe(item))
  }
}

function defineReactive(data, key, val) {
  observe(val)

  // every reactive data has a dep
  const dep = new Dep()

  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      if (Dep.target) {
        dep.depend()
      }

      return val
    },

    set(newVal) {
      if (newVal === val) {
        return
      }
      observe(newVal)
      val = newVal
      dep.notify()
    },
  })
}

export default function observe(data) {
  if (typeof data !== 'object' && data !== null) {
    return
  }

  if (data.__ob__ instanceof Observer) {
    return data.__ob__
  }

  return new Observer(data)
}

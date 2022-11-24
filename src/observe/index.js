import { newArrayProto } from './array'

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

  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      return val
    },

    set(newVal) {
      if (newVal === val) {
        return
      }
      observe(newVal)

      val = newVal
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

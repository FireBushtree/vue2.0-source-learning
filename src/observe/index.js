import { newArrayProto } from './array'
import { Dep } from './dep'

class Observer {
  constructor(data) {
    this.dep = new Dep()

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

function depentArray(val) {
  for (let i = 0; i < val.length; i++) {
    const current = val[i]
    current.__ob__ && current.__ob__.dep.depend()

    if (Array.isArray(current)) {
      depentArray(current)
    }
  }
}

function defineReactive(data, key, val) {
  const childOb = observe(val)

  // every reactive data has a dep
  const dep = new Dep()

  Object.defineProperty(data, key, {
    configurable: true,
    enumerable: true,
    get() {
      if (Dep.target) {
        dep.depend()

        childOb && childOb.dep.depend()

        if(Array.isArray(val)) {
          depentArray(val)
        }
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

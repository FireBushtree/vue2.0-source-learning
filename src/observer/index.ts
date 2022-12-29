export class Observer {
  constructor(value) {
    if (Array.isArray(value)) {

    } else {
      for (let key in value) {
        defineReactive(value, key, value[key])
      }
    }
  }
}

export function observe(value) {
  return new Observer(value)
}

export function defineReactive(obj, key, val) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      return val
    },
    set(newVal) {
      if (val === newVal) {
        return
      }
      console.log(123)
      val = newVal
    }
  })
}

import Vue from '../instance'
import { hasOwn } from '../util'
import { arrayMethods } from './array'
import Dep from './dep'

export class Observer {
  constructor(public value: any) {
    Object.defineProperty(value, '__ob__', {
      value: this,
      configurable: true,
      enumerable: false,
      writable: true
    })

    if (Array.isArray(value)) {
      //@ts-ignore
      value.__proto__ = arrayMethods
    } else {
      for (let key in value) {
        defineReactive(value, key, value[key])
      }
    }
  }
}

export function observe(value: any) {
  if (value && hasOwn(value, '__ob__')) {
    return value.__ob__
  }

  if (
    typeof value !== 'object' ||
    value === null ||
    value instanceof (Vue as any) ||
    Object.isFrozen(value)
  ) {
    return
  }

  return new Observer(value)
}

export function defineReactive(obj: object, key: string, val: any) {
  observe(val)
  const dep = new Dep()

  const property = Object.getOwnPropertyDescriptor(obj, key)
  const getter = property && property.get
  const setter = property && property.set

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.target) {
        dep.depend()
      }
      return getter ? getter.call(obj) : val
    },
    set(newVal) {
      if (val === newVal) {
        return
      }

      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }

      observe(val)
      dep.notify()
    }
  })
}

import Vue from '../instance'
import { arrayMethods } from './array'

export class Observer {
  constructor(value: any) {
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

export function observe(value: unknown) {
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

      val = newVal
      observe(val)
    }
  })
}

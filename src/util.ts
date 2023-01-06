export function isFunction(val: unknown) {
  return typeof val === 'function'
}

export function query(el: string | Element): Element {
  if (typeof el === 'string') {
    const node = document.querySelector(el)
    if (!node) {
      return document.createElement('div')
    }
    return node
  }
  return el
}

const hasOwnProperty = Object.prototype.hasOwnProperty
export function hasOwn(obj: Object | Array<any>, key: string): boolean {
  return hasOwnProperty.call(obj, key)
}

const _string = Object.prototype.toString
export function isPlainObject(obj: any): boolean {
  return _string.call(obj) === '[object Object]'
}

export function toString(val: any): string {
  return val === null
    ? ''
    : Array.isArray(val) || (isPlainObject(val) && val.toString === _string)
      ? JSON.stringify(val)
      : String(val)
}

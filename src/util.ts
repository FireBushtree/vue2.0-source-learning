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

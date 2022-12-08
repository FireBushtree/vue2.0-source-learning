const oldArrayProto = Array.prototype
export const newArrayProto = Object.create(oldArrayProto)

const methods = [
  'push',
  'pop',
  'shift',
  'unshift',
  'reverse',
  'sort',
  'splice'
]

methods.forEach(item => {
  newArrayProto[item] = function(...args) {
    const result = oldArrayProto[item].call(this, ...args)

    let instered = undefined
    let ob = this.__ob__

    if (item === 'push' || item === 'unshift') {
      instered = args
    }

    if (item === 'splice') {
      instered = args.slice(2)
    }

    if (instered) {
      ob.observeArray(instered)
    }

    ob.dep.notify()
    return result
  }
})

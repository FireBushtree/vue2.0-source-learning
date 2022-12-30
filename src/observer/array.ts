export const arrayMethods = Object.create(Array.prototype)
const methodList = [
  'pop',
  'push',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

methodList.forEach(key => {
  const origin = arrayMethods[key]

  arrayMethods[key] = function(...args: any) {
    const result = origin.apply(this, args)
    return result
  }
})

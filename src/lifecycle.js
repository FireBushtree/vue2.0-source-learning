import { nextTick, Watcher } from './observe/watcher'
import { createElementVNode, createTextVNode } from './vdom/index'

function patchProps(el, props) {
  for (const key in props) {
    if (key === 'style') {
      for (const styleName in props[key]) {
        el.style[styleName] = props[key][styleName]
      }
    } else {
      el.setAttribute(key, props[key])
    }
  }
}

function createElm(vnode) {
  const { tag, data, children, text } = vnode

  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    patchProps(vnode.el, data)
    children.forEach((item) => {
      vnode.el.appendChild(createElm(item))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}

function patch(oldVNode, vnode) {
  const isRealElement = oldVNode.nodeType

  if (isRealElement) {
    const elm = oldVNode
    const parentElm = elm.parentNode
    const newElm = createElm(vnode)
    parentElm.insertBefore(newElm, elm.nextSibling)
    parentElm.removeChild(elm)

    return newElm
  } else {
    // TODO diff
  }
}

export function initLifyCycle(Vue) {
  Vue.prototype.$nextTick = nextTick

  Vue.prototype._update = function (vnode) {
    const vm = this
    const el = vm.$el
    vm.$el = patch(el, vnode)
  }

  Vue.prototype._c = function () {
    return createElementVNode(this, ...arguments)
  }

  Vue.prototype._v = function () {
    return createTextVNode(this, ...arguments)
  }

  Vue.prototype._s = function (value) {
    return typeof value === 'string' ? value : JSON.stringify(value)
  }

  Vue.prototype._render = function () {
    const vm = this
    return vm.$options.render.call(vm)
  }
}

export function mountComponent(vm, el) {
  vm.$el = el

  const updateComponent = () => vm._update(vm._render())

  new Watcher(vm, updateComponent, true)
}

export function callhook(vm, hook) {
  const handlers = vm.$options[hook]

  if (handlers) {
    handlers.forEach(item => item.call(vm))
  }
}

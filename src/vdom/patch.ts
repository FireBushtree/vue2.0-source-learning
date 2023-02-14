import VNode from './vnode'

export function patch(oldVNode: VNode | Element | undefined, newVNode: VNode) {
  createElm(newVNode)
}

export function genAttr(node: HTMLElement, data: any) {
  if (data.attrs) {
    Object.keys(data.attrs).forEach(key => {
      node.setAttribute(key, data.attrs[key])
    })
  }
}

export function createElm(vnode: VNode, parentEl?: any) {
  const data = vnode.data
  const children = vnode.children
  const tag = vnode.tag
  if (tag) {
    vnode.elm = document.createElement(tag as keyof HTMLElementTagNameMap)
    genAttr(vnode.elm, data)
  } else if (vnode.text) {
    vnode.elm = document.createTextNode(vnode.text)
  }

  if (parentEl) {
    parentEl.appendChild(vnode.elm)
  }

  if (Array.isArray(children)) {
    children.forEach(item => {
      createElm(item, vnode.elm)
    })
  }
}

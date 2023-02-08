import VNode from "./vnode";

export function patch(oldVNode: VNode | Element | undefined, newVNode: VNode) {
  if (!oldVNode) {
    createElm(newVNode)
  }
}

export function createElm(vnode: VNode, parentEl?: any) {
    const data = vnode.data
    const children = vnode.children
    const tag = vnode.tag
    debugger
    if (tag) {
      vnode.elm = document.createElement(tag as keyof HTMLElementTagNameMap)
    } else if (vnode.text) {
      vnode.elm = document.createTextNode(vnode.text)
    }

    if (parentEl) {
      parentEl.appendChild(vnode.elm)
    }

    if (Array.isArray(children)) {
      children.forEach(item => {
        createElm(item)
      })
    }
}

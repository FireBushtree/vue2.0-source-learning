import { isSameVnode } from "./index";

function patchProps(el, oldProps, props) {
  const oldStyle = oldProps.style || {};
  const style = props.style || {};

  for (let key in oldStyle) {
    if (!style[key]) {
      el.style[key] = "";
    }
  }

  for (let key in oldProps) {
    if (!props[key]) {
      el.removeAttribute(key);
    }
  }

  for (const key in props) {
    if (key === "style") {
      for (const styleName in props[key]) {
        el.style[styleName] = props[key][styleName];
      }
    } else {
      el.setAttribute(key, props[key]);
    }
  }
}

export function createElm(vnode) {
  const { tag, data, children, text } = vnode;

  if (typeof tag === "string") {
    vnode.el = document.createElement(tag);
    patchProps(vnode.el, {}, data);
    children.forEach((item) => {
      vnode.el.appendChild(createElm(item));
    });
  } else {
    vnode.el = document.createTextNode(text);
  }

  return vnode.el;
}

export function patch(oldVnode, vnode) {
  const isRealElement = oldVnode.nodeType;

  if (isRealElement) {
    const elm = oldVnode;
    const parentElm = elm.parentNode;
    const newElm = createElm(vnode);
    parentElm.insertBefore(newElm, elm.nextSibling);
    parentElm.removeChild(elm);

    return newElm;
  } else {
    patchVnode(oldVnode, vnode);
  }
}

function patchVnode(oldVnode, vnode) {
  if (!isSameVnode(oldVnode, vnode)) {
    const el = createElm(vnode);
    oldVnode.el.parentNode.replaceChild(el, oldVnode.el);
    return el;
  }

  const el = (vnode.el = oldVnode.el);
  if (!vnode.tag) {
    if (oldVnode.text !== vnode.text) {
      el.textContent = vnode.text;
    }
  }

  patchProps(el, vnode.data, oldVnode.data);

  const oldChildren = oldVnode.children || [];
  const newChildren = vnode.children;

  if (oldChildren.length > 0 && newChildren.length > 0) {
  } else if (newChildren.length > 0) {
    mountChildren(el, newChildren);
  } else if (oldChildren.length > 0) {
    el.innerHTML = "";
  }
}

function mountChildren(el, children) {
  for (let i = 0; i < children.length; i++) {
    const node = createElm(children[i]);
    el.appendChild(node);
  }
}

function updateChildren(el, oldChildren, newChildren) {
  let oldStartIndex = 0;
  let newStartIndex = 0;
  let oldEndIndex = oldChildren.length - 1;
  let newEndIndex = newChildren.length - 1;

  let oldStartNode = oldChildren[oldStartIndex];
  let newStartNode = newChildren[newStartIndex];
  let oldEndNode = oldChildren[oldEndIndex];
  let newEndNode = newChildren[newEndIndex];

  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (isSameVnode(oldStartNode, newStartNode)) {
      patchVnode(oldStartNode, newStartNode);
      oldStartNode = oldChildren[++oldStartIndex];
      newStartNode = newChildren[++newStartIndex];
    }

    if (isSameVnode(oldEndNode, newEndNode)) {
      patchVnode(oldEndNode, newEndNode);
      oldStartNode = oldChildren[--oldEndIndex];
      newStartNode = newChildren[--newEndIndex];
    }
  }

  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      const childEl = createElm(newChildren[i]);
      const anchor = newChildren[newStartIndex + 1] ? newChildren[newStartIndex].el : null
      el.insertBefore(childEl);
    }
  }

  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      const node = oldChildren[i].el;
      el.removeChild(node);
    }
  }
}

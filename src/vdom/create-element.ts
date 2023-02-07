import VNode from "./vnode";

export function createElement(tag: string, data: any, children: any) {
  return new VNode(tag, data, children)
}
export default class VNode {
  tag?: string
  data?: VNodeData
  children?: Array<VNode>
  text?: string
  elm?: any

  constructor(
    tag?: string,
    data?: VNodeData,
    children?: Array<VNode>,
    text?: string
  ) {
    this.tag = tag
    this.data = data
    this.children = children
    this.text = text
  }
}

export type VNodeData = {
  attrs: { [key: string]: any }
}

export function createTextVNode(val: string | number) {
  return new VNode(undefined, undefined, undefined, String(val))
}

import VNode from '@/vdom/vnode'
import { ComponentOptions } from './options'

export interface Options {
  el?: string
  data?: () => object
}

export declare class Component {
  constructor(options: Options)
  $options: ComponentOptions
  $el?: Element
  _vnode?: VNode
  $mount: (el: string | Element) => any
  _data: Record<string, any>
  _init: () => any
  _render: () => VNode
  _update: (vnode: VNode) => void
  _c: (tag: string, data: any, children: any) => VNode
}

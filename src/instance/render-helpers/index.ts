import { toString } from "@/util";
import { createTextVNode } from "@/vdom/vnode";

export function installRenderHelpers(target: any) {
  target._v = createTextVNode
  target._s = toString
}

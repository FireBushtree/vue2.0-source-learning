import { toString } from "@/util";
import { createTextNode } from "@/vdom/vnode";

export function installRenderHelpers(target: any) {
  target._v = createTextNode
  target._s = toString
}

import { parseHTML } from "./html-parser";

export function parse(template: string) {
  const ast = parseHTML(template)
  return ast
}

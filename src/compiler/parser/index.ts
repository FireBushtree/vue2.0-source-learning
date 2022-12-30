import { parseHTML } from "./html-parser";

export function parse(template: string) {
  return parseHTML(template)
}

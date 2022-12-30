import { ASTElement } from "@/types/compiler"

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
export const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function parseHTML(html: string) {
  const stack: Array<ASTElement> = []
  let root: ASTElement | undefined = undefined
  let curr: ASTElement | undefined = undefined
  while (html) {
    let textEnd = html.indexOf('<')

    function advance(length: number) {
      html = html.slice(length)
    }

    if (textEnd === 0) {
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        continue
      }

      const startTagMatch = html.match(startTagOpen)
      if (startTagMatch) {
        curr = {
          tag: startTagMatch[1],
          parent: stack[stack.length - 1],
          type: 1,
          children: [],
          attrs: []
        }

        if (!root) {
          root = curr
        }
        debugger
        advance(startTagMatch[0].length)
        continue
      }
    }

    break
  }
}

import { ASTAttr, ASTElement, ASTTempNode } from '@/types/compiler'
import { parseText } from './text-parser'

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

    if (textEnd === 0) {
      // end
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        advance(endTagMatch[0].length)
        stack.pop()
        curr = stack[stack.length - 1]
      }

      // start
      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        handleStartTag(startTagMatch)
      }
    }

    let text, rest
    if (textEnd >= 0) {
      // do not handle white space
      text = html.substring(0, textEnd)
      if (text.replace(/\s/g, '')) {
        rest = html.slice(textEnd)
        const textMatch = parseText(text)
        handleText(textMatch, text)
      }

      advance(textEnd)
      continue
    }
  }

  return root

  function advance(length: number) {
    html = html.slice(length)
  }

  function parseStartTag() {
    const start = html.match(startTagOpen)
    if (start) {
      const temp: any = {
        tag: start[1],
        attrs: []
      }
      advance(start[0].length)
      let end, attr
      while (
        !(end = html.match(startTagClose)) &&
        (attr = html.match(attribute))
      ) {
        temp.attrs.push(attr)
        advance(attr[0].length)
      }

      if (end) {
        advance(end[0].length)
      }

      return temp
    }
  }

  function handleStartTag(match: any) {
    const l = match.attrs.length
    const attrs: Array<ASTAttr> = new Array(l)

    for (let i = 0; i < match.attrs.length; i++) {
      const args: any = match.attrs[i]
      const attr = {
        name: args[1],
        value: args[3] || args[4] || args[5] || ''
      }

      attrs[i] = attr
    }

    const tempNode: ASTElement = {
      tag: match.tag,
      attrs,
      type: 1,
      children: []
    }
    stack.push(tempNode)
    if (curr) {
      curr.children.push(tempNode)
    }

    curr = tempNode

    if (!root) {
      root = curr
    }
  }

  function handleText(match: any, text: string) {
    if (!curr) {
      return
    }

    if (match) {
      curr.children.push({
        type: 2,
        expression: match.expression
      })
    } else {
      curr.children.push({
        type: 3,
        text
      })
    }
  }
}

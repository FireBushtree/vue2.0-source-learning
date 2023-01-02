import { ASTAttr, ASTElement, ASTTempNode } from '@/types/compiler'

const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
export const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export function parseHTML(html: string) {
  const stack: Array<ASTTempNode> = []
  let root: ASTElement | undefined = undefined
  let curr: ASTElement | undefined = undefined
  while (html) {
    let textEnd = html.indexOf('<')

    if (textEnd === 0) {
      const endTagMatch = html.match(endTag)
      if (endTagMatch) {
        continue
      }

      const startTagMatch = parseStartTag()
      if (startTagMatch) {
        handleStartTag(startTagMatch)
      }
    }

    let rest
    if (textEnd >= 0) {
      rest = html.slice(textEnd)
    }

    break
  }

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

    stack.push({
      tag: match.tag,
      attrs,
    })
  }
}

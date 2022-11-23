const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const startTagClose = /^\s*(\/?)>/
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
export const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

export const ELEMENT_TYPE = 1
export const TEXT_TYPE = 3

export function parseHTML(html) {
  const stack = []
  let currentTag = undefined
  let root = undefined

  function createASTElement(tag, attrs) {
    return {
      tag,
      type: ELEMENT_TYPE,
      children: [],
      attrs,
      parent: null,
    }
  }

  function start(tagName, attrs) {
    const ast = createASTElement(tagName, attrs)

    if (!root) {
      root = ast
    } else if (currentTag) {
      currentTag.children.push(ast)
      ast.parent = currentTag
    }

    currentTag = ast
    stack.push(ast)
  }

  function chars(text) {
    text = text.replace(/\s/g, '')
    text &&
      currentTag.children.push({
        type: TEXT_TYPE,
        text,
        parent: currentTag,
      })
  }

  function end(tagName) {
    stack.pop()
    currentTag = stack[stack.length - 1]
  }

  while (html) {
    const textEnd = html.indexOf('<')

    function advance(n) {
      html = html.substring(n)
    }

    function parseStartTag() {
      const start = html.match(startTagOpen)

      if (start) {
        const match = {
          tagName: start[1],
          attrs: [],
        }

        advance(start[0].length)

        let attr
        let end
        while (
          !(end = html.match(startTagClose)) &&
          (attr = html.match(attribute))
        ) {
          advance(attr[0].length)

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5],
          })
        }

        if (end) {
          advance(end[0].length)
        }

        return match
      }

      return false
    }

    if (textEnd === 0) {
      const startTagMatch = parseStartTag()

      if (startTagMatch) {
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      let endTagName = html.match(endTag)

      if (endTagName) {
        end(endTagName[1])
        advance(endTagName[0].length)
        continue
      }
    }

    if (textEnd > 0) {
      const text = html.substring(0, textEnd)

      if (text) {
        chars(text)
        advance(text.length)
      }
    }
  }

  return root
}

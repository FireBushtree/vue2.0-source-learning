const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`);
const startTagClose = /^\s*(\/?)>/;
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);
const attribute =
  /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

function parseHTML(html) {
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
          attrs: []
        }

        advance(start[0].length)

        let attr
        let end
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length)

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
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
        continue
      }

      let endTagName = html.match(endTag)

      if (endTagName) {
        advance(endTagName[0].length)
        continue
      }
    }

    if (textEnd > 0) {
      const text = html.substring(0, textEnd)

      if (text) {
        advance(text.length)
      }
    }
  }
}

export function compileToFunction(template) {
  const ast = parseHTML(template)
}

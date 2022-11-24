import { defaultTagRE, ELEMENT_TYPE, parseHTML, TEXT_TYPE } from './parse'

function genProps(attrs) {
  let str = ''

  attrs.forEach((attr) => {
    if (attr.name === 'style') {
      const valArray = attr.value.split(';')
      attr.value = {}
      valArray.forEach((item) => {
        const [key, value] = item.split(':')
        attr.value[key] = value
      })
    }

    str += `${attr.name}:${JSON.stringify(attr.value)},`
  })

  return `{${str.slice(0, -1)}}`
}

function gen(node) {
  if (node.type === ELEMENT_TYPE) {
    return codegen(node)
  } else if (node.type === TEXT_TYPE) {
    if (!defaultTagRE.test(node.text)) {
      return `_v(${JSON.stringify(node.text)})`
    } else {
      const tokens = []
      let match
      let lastIndex = 0
      defaultTagRE.lastIndex = 0
      while ((match = defaultTagRE.exec(node.text))) {
        if (match.index > lastIndex) {
          const middleText = node.text.slice(lastIndex, match.index)
          tokens.push(JSON.stringify(middleText))
        }
        tokens.push(`_s(${match[1]})`)
        lastIndex = match.index + match[0].length
      }

      if (lastIndex < node.text.length - 1) {
        tokens.push(JSON.stringify(node.text.slice(lastIndex)))
      }

      return `_v(${tokens.join('+')})`
    }
  }
}

function genChildren(children) {
  if (children) {
    return children.map((item) => gen(item)).join(',')
  }
}

function codegen(ast) {
  const code = `_c('${ast.tag}', ${
    ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'
    } ${ast.children.length ? `,${genChildren(ast.children)}` : ''})`
  return code
}

export function compileToFunction(template) {
  const ast = parseHTML(template)
  console.log(ast)
  let code = codegen(ast)
  code = `with(this) {
    return ${code}
  }`
  console.log(code)
  const render = new Function(code)

  return render
}

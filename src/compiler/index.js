import { parseHTML } from "./parse";

function genProps(attrs) {
  let str = ''

  attrs.forEach(attr => {
    if (attr.name === 'style') {
      const valArray = attr.value.split(';')
      attr.value = {}
      valArray.forEach(item => {
        const [key, value] = item.split(':')
        attr.value[key] = value
      })
    }

    str += `${attr.name}:${JSON.stringify(attr.value)},`
  })

  return `{${str.slice(0, -1)}}`
}

function genChildren(el) {
  const children = el.children

  if (children) {
    return children.map(item => gen(item),join(','))
  }
}

function codegen(ast) {
  const code = `_c('${ast.tag}', ${ ast.attrs.length > 0 ? genProps(ast.attrs) : 'null' } ${ast.children.length ? `,${ast.children}` : ''})`
  console.log(code)
}

export function compileToFunction(template) {
  const ast = parseHTML(template);
  console.log(ast);

  codegen(ast)
}

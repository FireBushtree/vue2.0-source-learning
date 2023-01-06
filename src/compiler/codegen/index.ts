import { ASTAttr, ASTElement, ASTExpression, ASTNode, ASTText } from "@/types/compiler";

export function generate(ast: ASTElement | undefined) {
  const code = ast ? genElement(ast) : 'null'
  return {
    render: `with(this){ return ${code} }`
  }
}

export function genElement(el: ASTElement) {
  const data = genData(el)

  const tag = `'${el.tag}'`
  const children = genChildren(el)
  const code = `_c(${tag}${
    data ? `,${data}` : ''
  }${
    children ? `,${children}` : ''
  })`

  return code
}

export function genChildren(el: ASTElement): string {
  return `[${el.children.map(item => gen(item))}]`
}

export function gen(el: ASTNode) {
  if (el.type === 1) {
    return genElement(el)
  } else {
    return genText(el)
  }
}

export function genText(el: ASTExpression | ASTText) {
  return `_v(${el.type === 2 ? el.expression : JSON.stringify(el.text)})`
}

export function genData(el: ASTElement) {
  let data = '{'

  if (el.attrs && el.attrs.length > 0) {
    data += `attrs:${genProps(el.attrs)}`
  }

  data += '}'

  return data
}

export function genProps(props: Array<ASTAttr>) {
  let staticProps = ''

  for (let i = 0; i < props.length; i++) {
    const prop = props[i]
    staticProps += `"${prop.name}": ${JSON.stringify(prop.value)},`
  }
  staticProps = `{${staticProps.slice(0, -1)}}`
  return staticProps
}

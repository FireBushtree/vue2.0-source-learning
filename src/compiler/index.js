import { parseHTML } from "./parse";

function genProps(attrs) {

}

function codegen(ast) {
  const code = `_c('${ast.tag}', ${ ast.attrs.length > 0 ? genProps(ast.attrs) : 'null' })`
}

export function compileToFunction(template) {
  const ast = parseHTML(template);
  console.log(ast);

  codegen(ast)
}

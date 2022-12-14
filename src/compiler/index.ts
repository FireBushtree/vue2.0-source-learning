import { generate } from "./codegen";
import { parse } from "./parser";

export function compileToFunction(template: string) {
  // 1. gen ast
  const ast = parse(template)
  // 2. gen code
  const code = generate(ast)

  return {
    ast,
    render: code.render
  }
}

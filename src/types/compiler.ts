export type ASTNode = ASTElement | ASTText

export type ASTText = {
  type: 3
  text: string
}

export type ASTAttr = {
  name: string
  value: any
}

export type ASTElement = {
  type: 1
  tag: string
  attrs: Array<ASTAttr>
  children: Array<ASTNode>
  parent: ASTElement | void
}

export type ASTTempNode = {
  tag: string
  attrs: ASTAttr[]
}

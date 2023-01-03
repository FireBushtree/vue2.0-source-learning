import { defaultTagRE } from './html-parser'

export function parseText(text: string) {
  const reg = defaultTagRE
  let match
  let lastIndex = 0
  const tokens: string[] = []
  const rawTokens: any[] = []

  while ((match = reg.exec(text))) {
    const index = match.index

    if (index > lastIndex) {
      tokens.push(text.slice(lastIndex, index))
    }

    const exp = match[1].trim()
    tokens.push(`_s(${exp})`)
    lastIndex += match[0].length
  }

    return {
    expression: tokens.join('+'),
  }
}

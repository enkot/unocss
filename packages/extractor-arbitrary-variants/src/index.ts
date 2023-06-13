import type { Extractor } from '@unocss/core'
import { CountableSet, defaultSplitRE, isValidSelector } from '@unocss/core'

export const quotedArbitraryValuesRE = /(?:[\w&:[\]-]|\[\S+=\S+\])+\[\\?['"]?\S+?['"]\]\]?[\w:-]*/g
export const arbitraryPropertyRE = /\[(\\\W|[\w-])+:[^\s:]*?("\S+?"|'\S+?'|`\S+?`|[^\s:]+?)[^\s:]*?\)?\]/g
const arbitraryPropertyCandidateRE = /^\[(\\\W|[\w-])+:['"]?\S+?['"]?\]$/

export function splitCodeWithArbitraryVariants(code: string, envMode?: string) {
  const result = new (envMode === 'dev' ? CountableSet : Set)<string>()

  for (const match of code.matchAll(arbitraryPropertyRE)) {
    if (!code[match.index! - 1]?.match(/^[\s'"`]/))
      continue

    result.add(match[0])
  }

  for (const match of code.matchAll(quotedArbitraryValuesRE))
    result.add(match[0])

  code
    .split(defaultSplitRE)
    .forEach((match) => {
      if (isValidSelector(match) && !arbitraryPropertyCandidateRE.test(match))
        result.add(match)
    })

  return [...result]
}

export const extractorArbitraryVariants: Extractor = {
  name: '@unocss/extractor-arbitrary-variants',
  order: 0,
  extract({ code, envMode }) {
    return splitCodeWithArbitraryVariants(code, envMode)
  },
}

export default extractorArbitraryVariants

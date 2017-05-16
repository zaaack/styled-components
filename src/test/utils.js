// @flow

/**
 * This sets up our end-to-end test suite, which essentially makes sure
 * our public API works the way we promise/want
 */
import { wavefunction as dom } from '../index'
import { wavefunction as noparser } from '../no-parser'
import StyleSheet from '../models/StyleSheet'

/* Ignore hashing, just return class names sequentially as .a .b .c etc */
let index = 0
let kf_index = 0
let seededClassnames = []
const classNames = () => seededClassnames.shift() || String.fromCodePoint(97 + index++)

export const seedNextClassnames = (names: Array<string>) => seededClassnames = names

const reset = (wf, ssr: boolean) => {
  if (!document.head) throw new Error("Missing document <head>")
  document.head.innerHTML = ''
  StyleSheet.reset(ssr)
  index = 0

  const wavefunction = wf.clone()

  wavefunction.modify({
    nameGenerator: () => classNames,
    keyframesNameGenerator: () => () => `keyframe_${kf_index++}`,
  })

  return wavefunction
}
export const resetStyled = () => reset(dom, false)
export const resetSSR = () => reset(dom, true)
export const resetNoParserStyled = () => reset(noparser, false)

const stripComments = (str: string) =>
  str.replace(/\/\*.*?\*\/\n?/g, '')

export const stripWhitespace = (str: string) =>
  str.trim().replace(/([;\{\}])/g, '$1  ').replace(/\s+/g, ' ')

export const expectCSSMatches = (expectation: string, opts: { ignoreWhitespace: boolean } = { ignoreWhitespace: true }) => {
  const css = Array.from(document.querySelectorAll('style')).map(tag => tag.innerHTML).join("\n")

  if (opts.ignoreWhitespace) {
    const stripped = stripWhitespace(stripComments(css))
    expect(stripped).toEqual(stripWhitespace(expectation))
    return stripped
  } else {
    expect(css).toEqual(expectation)
    return css
  }
}

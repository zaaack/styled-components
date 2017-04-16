// @flow
import stylis from 'stylis'
import type { RuleSet } from '../models/RuleSet'

const stringifyRules = (
  ruleSet: RuleSet,
  selector: ?string,
  prefix: ?string,
): string => {
  const flatCSS = ruleSet
    .toCssString()
    .replace(/^\s*\/\/.*$/gm, '') // replace JS comments

  const cssStr = (selector && prefix) ?
    `${prefix} ${selector} { ${flatCSS} }` :
    flatCSS

  const css = stylis(
    prefix || !selector ? '' : selector,
    cssStr,
    false,
    false,
  )

  return css
}

export default stringifyRules

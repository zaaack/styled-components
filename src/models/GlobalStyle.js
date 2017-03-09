// @flow
import type { RuleSet } from '../types'
import flatten from '../utils/flatten'
import styleSheet from './StyleSheet'

type PreProcessor = (selector: string, css: string, opt1?: boolean, opt2?: boolean) => string

export default (preprocessor: PreProcessor) => class ComponentStyle {
  rules: RuleSet;
  selector: ?string;

  constructor(rules: RuleSet, selector: ?string) {
    this.rules = rules
    this.selector = selector
  }

  generateAndInject() {
    if (!styleSheet.injected) styleSheet.inject()
    const flatCSS = flatten(this.rules).join('')
    const cssString = this.selector ? `${this.selector} { ${flatCSS} }` : flatCSS
    const css = preprocessor('', cssString, false, false)
    styleSheet.insert(css)
  }
}

export default class RuleSet {
  rules: Array<Interpolation>

  constructor(rules: Array<Interpolation>) {
    this.rules = rules
  }

  concat(otherSet: RuleSet) {
    return new RuleSet(this.rules.concat(otherSet.rules))
  }

  toCssString() {
    return this.rules.join('')
  }

  toString() {
    console.warn("Unexpected toString called on RuleSet. You should always use the 'css' template function when defining CSS snippets.")
    /* Join ourselves anyway. If there's no DeferredInterpolations, it might work ok. */
    return this.toCssString()
  }
}

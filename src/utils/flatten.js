// @flow
import hyphenate from 'fbjs/lib/hyphenateStyleName'
import isPlainObject from 'is-plain-object'
import RuleSet from '../models/RuleSet'

import type { Interpolation } from '../types'

export const objToCss = (obj: Object, prevKey?: string): string => {
  const css = Object.keys(obj).map(key => {
    if (isPlainObject(obj[key])) return objToCss(obj[key], key)
    return `${hyphenate(key)}: ${obj[key]};`
  }).join(' ')
  return prevKey ? `${prevKey} {
  ${css}
}` : css
}

const flatten = (chunks: Array<Interpolation>, executionContext: ?Object): RuleSet => (
  new RuleSet(chunks.reduce((ruleSet: Array<Interpolation>, chunk: ?Interpolation) => {
    /* Remove falsey values (but not 0) */
    if (chunk === undefined || chunk === null || chunk === false || chunk === '') return ruleSet
    /* Flatten RuleSet */
    if (chunk instanceof RuleSet) return [...ruleSet, ...flatten(chunk.rules, executionContext)]

    /* Handle other components */
    // $FlowFixMe not sure how to make this pass
    if (chunk.hasOwnProperty('styledComponentId')) return [...ruleSet, `.${chunk.styledComponentId}`]

    /* Either execute or defer the function */
    if (typeof chunk === 'function') {
      return executionContext
        ? ruleSet.concat(...flatten([chunk(executionContext)], executionContext))
        : ruleSet.concat(chunk)
    }

    /* Handle objects */
    // $FlowFixMe have to add %checks somehow to isPlainObject
    return ruleSet.concat(isPlainObject(chunk) ? objToCss(chunk) : chunk.toString())
  }, []))
)

export default flatten

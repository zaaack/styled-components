// @flow
import interleave from '../utils/interleave'
import flatten from '../utils/flatten'
import type { Interpolation } from '../types'
import type { RuleSet } from '../models/RuleSet'

export default (strings: Array<string>, ...interpolations: Array<Interpolation>): RuleSet => (
  flatten(interleave(strings, interpolations))
)

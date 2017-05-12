// @flow
import interleave from '../utils/interleave'
import type { Interpolation, RuleSet, Flattener } from '../types'

export default ({ flatten }: { flatten: Flattener }) => (
  (strings: Array<string>, ...interpolations: Array<Interpolation>): RuleSet => (
    flatten(interleave(strings, interpolations))
  )
)

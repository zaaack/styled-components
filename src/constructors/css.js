// @flow
import interleave from '../utils/interleave'
import type { Interpolation, RuleSet, Flattener } from '../types'

export default (wf) => {
  const { flatten }: { flatten: Flattener } = wf
  return (
    (strings: Array<string>, ...interpolations: Array<Interpolation>): RuleSet => (
      flatten(interleave(strings, interpolations))
    )
  )
}

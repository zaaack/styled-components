// @flow
import type { Interpolation, RuleSet, Flattener } from '../types'

export default ({ flatten }: { flatten: Flattener }) => (
  (interpolations: Array<Interpolation>): RuleSet => flatten(interpolations)
)

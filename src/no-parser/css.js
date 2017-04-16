// @flow
import flatten from './flatten'
import type { RuleSet } from '../models/RuleSet'
import type { Interpolation } from '../types'

export default (interpolations: Array<Interpolation>): RuleSet => flatten(interpolations)

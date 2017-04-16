// @flow
import type { RuleSet } from './models/RuleSet'

export type DeferredInterpolation = (executionContext: Object) => Interpolation
export type Interpolation = DeferredInterpolation |
  string |
  number |
  RuleSet

/* eslint-disable no-undef */
export type Target = string | ReactClass<*>

export type NameGenerator = (hash: number) => string

export type Flattener = (
  chunks: Array<Interpolation>,
  executionContext: ?Object
) => Array<Interpolation>

export type Stringifier = (
  rules: Array<Interpolation>,
  selector: ?string,
  prefix: ?string
) => string

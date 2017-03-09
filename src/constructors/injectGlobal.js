// @flow
import css from './css'
import type { Interpolation } from '../types'

const injectGlobal = (GlobalStyle: ComponentStyle) =>
  (strings: Array<string>, ...interpolations: Array<Interpolation>) => {
    const globalStyle = new GlobalStyle(css(strings, ...interpolations))
    globalStyle.generateAndInject()
  }

export default injectGlobal

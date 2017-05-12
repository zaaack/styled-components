// @flow

import Superposition from './superposition/index'

/* Import singletons */
import flatten from './utils/flatten'
import stringifyRules from './utils/stringifyRules'
import generateAlphabeticName from './utils/generateAlphabeticName'
import css from './constructors/css'
import ServerStyleSheet from './models/ServerStyleSheet'
import StyleSheetManager from './models/StyleSheetManager'

/* Import singleton constructors */
import StyledComponent from './models/StyledComponent'
import ComponentStyle from './models/ComponentStyle'
import styled from './constructors/styled'
import keyframes from './constructors/keyframes'
import injectGlobal from './constructors/injectGlobal'
import constructWithOptions from './constructors/constructWithOptions'

/* Import components */
import ThemeProvider from './models/ThemeProvider'

/* Import Higher Order Components */
import withTheme from './hoc/withTheme'

/* Export everything */
export default new Superposition({
  flatten: () => flatten,
  nameGenerator: () => generateAlphabeticName,
  keyframesNameGenerator: ({nameGenerator}) => nameGenerator,
  stringifyRules: () => stringifyRules,
  css,
  ServerStyleSheet: () => ServerStyleSheet,
  StyleSheetManager: () => StyleSheetManager,
  StyledComponent,
  ComponentStyle,
  styled,
  keyframes,
  injectGlobal,
  constructWithOptions,
  ThemeProvider: () => ThemeProvider,
  withTheme: () => withTheme,
})

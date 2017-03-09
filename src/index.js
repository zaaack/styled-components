// @flow

import stylis from 'stylis'

/* Import singletons */
import generateAlphabeticName from './utils/generateAlphabeticName'
import css from './constructors/css'
import _injectGlobal from './constructors/injectGlobal'
import styleSheet from './models/StyleSheet'

/* Import singleton constructors */
import _styledComponent from './models/StyledComponent'
import _styled from './constructors/styled'
import _keyframes from './constructors/keyframes'
import _ComponentStyle from './models/ComponentStyle'
import _GlobalStyle from './models/GlobalStyle'

/* Import components */
import ThemeProvider from './models/ThemeProvider'

/* Import Higher Order Components */
import withTheme from './hoc/withTheme'

/* Instantiate singletons */
const GlobalStyle = _GlobalStyle(stylis)
const keyframes = _keyframes(generateAlphabeticName, GlobalStyle)
const styled = _styled(_styledComponent(_ComponentStyle(generateAlphabeticName)))
const injectGlobal = _injectGlobal(GlobalStyle)

/* Export everything */
export default styled
export { css, keyframes, injectGlobal, ThemeProvider, withTheme, styleSheet }

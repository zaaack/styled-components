// @flow

/* Import singletons */
import generateAlphabeticName from './utils/generateAlphabeticName'
import _injectGlobal from './constructors/injectGlobal'

/* Import singleton constructors */
import _keyframes from './constructors/keyframes'
import _GlobalStyle from './models/GlobalStyle'

const preprocessor = (selector: string, css: string) => css.replace(/__SCOPE_ME__/g, selector)
const GlobalStyle = _GlobalStyle(preprocessor)

/* Instantiate singletons */
const keyframes = (name: string) => _keyframes(() => name, GlobalStyle)
const injectGlobal = _injectGlobal(GlobalStyle)

/* Export everything */
export { keyframes, injectGlobal }

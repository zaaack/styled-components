// @flow

/* Import singletons */
import _injectGlobal from './constructors/injectGlobal'

/* Import singleton constructors */
import _keyframes from './constructors/keyframes'
import _GlobalStyle from './models/GlobalStyle'

/* Instantiate singletons */
const noopPreprocessor = (selector: string, css: string) => css
const GlobalStyle = _GlobalStyle(noopPreprocessor)
const keyframes = (name: string) => _keyframes(() => name, GlobalStyle)
const injectGlobal = _injectGlobal(GlobalStyle)

/* Export everything */
export { keyframes, injectGlobal }

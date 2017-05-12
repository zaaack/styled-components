// TODO: restore flow

/* Import no-parser singleton variants */
import flatten from './flatten'
import stringifyRules from './stringifyRules'
import _css from './css'

import superposition from '../superposition'

export const wavefunction = superposition.createWavefunction()
wavefunction.modify({
  flatten: () => flatten,
  stringifyRules: () => stringifyRules,
  css: _css,
})

export default wavefunction.styled
export const {
  css,
  keyframes,
  injectGlobal,
  ThemeProvider,
  withTheme,
  ServerStyleSheet,
  StyleSheetManager,
} = wavefunction

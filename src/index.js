import superposition from './superposition'

export const wavefunction = superposition.createWavefunction()
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


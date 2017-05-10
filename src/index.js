import superposition from "./superposition"
const wavefunction = superposition.createWavefunction()

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

export { wavefunction }

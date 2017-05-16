// @flow

import superposition from '../superposition'

import StyledNativeComponent from './StyledNativeComponent'
import styled from './styled'

const wf = superposition.createWavefunction()
wf.modify({
  styled,
  StyledComponent: StyledNativeComponent,
})

const { css, ThemeProvider, withTheme } = wf
export { css, ThemeProvider, withTheme }
export default wf.styled

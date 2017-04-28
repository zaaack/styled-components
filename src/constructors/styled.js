// @flow
import type { Target } from '../types'
import domElements from '../utils/domElements'



export default (StyledComponent: Function, constructWithOptions: Function) => {
  const styled = (tag: Target) => constructWithOptions(StyledComponent, tag)

  // Shorthands for all valid HTML Elements
  domElements.forEach(domElement => {
    styled[domElement] = styled(domElement)
  })

  return styled
}

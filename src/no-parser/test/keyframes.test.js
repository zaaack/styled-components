// @flow
import { resetNoParserStyled, expectCSSMatches } from '../../test/utils'

let keyframes

describe('keyframes', () => {
  beforeEach(() => {
    keyframes = resetNoParserStyled().keyframes
  })

  it('should correctly assemble preprocessed CSS', () => {
    const name = keyframes([
      ['@-webkit-keyframes '],
      [' {from {background-position: 0vw 0px;}to {background-position: 100vw 0px;}} @keyframes '],
      [' {from {background-position: 0vw 0px;}to {background-position: 100vw 0px;}}']
    ])

    expectCSSMatches(`@-webkit-keyframes ${name} {from {background-position: 0vw 0px;}to {background-position: 100vw 0px;}} @keyframes ${name} {from {background-position: 0vw 0px;}to {background-position: 100vw 0px;}}`)
  })
})

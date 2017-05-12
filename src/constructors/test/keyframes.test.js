// @flow
import { expectCSSMatches, resetStyled } from '../../test/utils'

/**
 * Setup
 */
let keyframes

describe('keyframes', () => {
  beforeEach(() => {
    keyframes = resetStyled().keyframes
  })

  it('should return its name', () => {
    expect(keyframes`
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    `).toEqual('keyframe_0')
  })

  it('should insert the correct styles', () => {
    const rules = `
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    `

    const name = keyframes`${rules}`
    expectCSSMatches(`
      @-webkit-keyframes ${name} {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }

      @keyframes ${name} {
        0% {
          opacity: 0;
        }
        100% {
          opacity: 1;
        }
      }
    `)
  })
})

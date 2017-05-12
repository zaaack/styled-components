// @flow
import React, { Component } from 'react'
import { shallow } from 'enzyme'

import { expectCSSMatches, resetStyled } from '../../test/utils'

let injectGlobal, styled
const rule1 = 'width: 100%;'
const rule2 = 'padding: 10px;'
const rule3 = 'color: blue;'

describe('injectGlobal', () => {
  beforeEach(() => {
    const reset = resetStyled()
    injectGlobal = reset.injectGlobal
    styled = reset.styled
  })

  it(`should inject rules into the head`, () => {
    injectGlobal`
      html {
        ${rule1}
      }
    `
    expectCSSMatches(`
      html {
        ${rule1}
      }
    `)
  })

  it(`should non-destructively inject styles when called repeatedly`, () => {
    injectGlobal`
      html {
        ${rule1}
      }
    `

    injectGlobal`
      a {
        ${rule2}
      }
    `
    expectCSSMatches(`
      html {
        ${rule1}
      }
      a {
        ${rule2}
      }
    `)
  })

  it(`should non-destructively inject styles when called after a component`, () => {
    const Comp = styled.div`
      ${rule3}
    `
    shallow(<Comp />)

    injectGlobal`
      html {
        ${rule1}
      }
    `

    expectCSSMatches(`
      .sc-a {}
      .b {
        ${rule3}
      }
      html {
        ${rule1}
      }
    `)
  })
});

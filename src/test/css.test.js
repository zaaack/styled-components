// @flow
import React from 'react'
import { shallow } from 'enzyme'

import { resetStyled, expectCSSMatches } from './utils'
import css from '../constructors/css'

let styled

describe('css features', () => {
  beforeEach(() => {
    styled = resetStyled()
  })

  it('should add vendor prefixes in the right order', () => {
    const Comp = styled.div`
      transition: opacity 0.3s;
    `
    shallow(<Comp />)
    expectCSSMatches('.sc-a {} .b { -webkit-transition: opacity 0.3s; transition: opacity 0.3s; }')
  })

  it('should add vendor prefixes for display', () => {
    const Comp = styled.div`
      display: flex;
      flex-direction: column;
      align-items: center;
    `
    shallow(<Comp />)
    expectCSSMatches(`
      .sc-a {}
      .b {
        display: -webkit-box; display: -webkit-flex; display: -ms-flexbox; display: flex; -webkit-flex-direction: column; -ms-flex-direction: column; flex-direction: column; -webkit-align-items: center; -webkit-box-align: center; -ms-flex-align: center; align-items: center;
      }
    `)
  })

  it('should pass through custom properties', () => {
    const Comp = styled.div`
      --custom-prop: some-val;
    `
    shallow(<Comp />)
    expectCSSMatches('.sc-a {} .b { --custom-prop: some-val; }')
  })

  it('should handle pseudo selectors', () => {
    const Comp = styled.div`
      color: red;
      &:hover {
        color: black;
      }
    `
    shallow(<Comp />)
    expectCSSMatches('.sc-a { } .b { color: red; } .b:hover { color: black; }')
  })

  it('should handle media queries', () => {
    const Comp = styled.div`
      font-size: 1.5rem;
      @media (min-width: 600px) {
        font-size: 1.25rem;
      }
    `
    shallow(<Comp />)
    expectCSSMatches('.sc-a { } .b { font-size: 1.5rem; } @media (min-width: 600px) { .b { font-size: 1.25rem; } }')
  })

  it('should handle media queries and pseudos', () => {
    const Comp = styled.div`
      color: red;
      font-size: 1.5rem;
      @media (max-width: 600px) {
        font-size: 1.25rem;
      }
      &:hover {
        color: black;
      }
    `
    shallow(<Comp />)
    expectCSSMatches(`
      .sc-a { } .b { color: red; font-size: 1.5rem; } 
      @media (max-width: 600px) { .b { font-size: 1.25rem; } } 
      .b:hover { color: black; }
    `)
  })

  it('should handle media queries and pseudos with interpolations', () => {
    const handheld = (...args) => css`@media (max-width: 600px) { ${ css(...args) } }`
    const h2 = css`
      font-size: 1.5rem;
      ${handheld`
        font-size: 1.25rem;
      `}
    `

    const Comp = styled.div`
      color: red;
      ${ h2 }
      &:hover {
        color: white;
      }
    `
    shallow(<Comp />)
    expectCSSMatches(`
      .sc-a { } .b { color: red; font-size: 1.5rem; } 
      @media (max-width: 600px) { .b { font-size: 1.25rem; } } 
      .b:hover { color: white; }
    `)
  })

  describe('catching warnings', () => {
    const _warn = console.warn
    let warnings
    beforeEach(() => {
      warnings = []
      console.warn = (msg) => warnings.push(msg)
    })

    afterEach(() => {
      console.warn = _warn
    })
    it('should warn if you accidentally flatten an interpolation', () => {
      const handheld = (...args) => css`@media (max-width: 600px) { ${ css(...args) } }`
      /* MISSING CALL TO CSS */
      const h2 = `
        font-size: 1.5rem;
        ${handheld`
          font-size: 1.25rem;
        `}
      `

      const Comp = styled.div`
        color: red;
        ${ h2 }
        &:hover {
          color: white;
        }
      `
      shallow(<Comp />)
      expectCSSMatches(`.sc-a { } .b { color: red; font-size: 1.5rem; }`)
      expect(warnings).toEqual(`Unexpected toString called on RuleSet. You should always use the 'css' template function when defining CSS snippets.`)
    })
  })
})

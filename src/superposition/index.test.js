import Superposition from './index'

describe('basic', () => {
  const Sum = ({ Constant }) => value => Constant + value
  const Product = ({ Constant }) => value => Constant * value
  const Constant = () => 7

  let wavefunction
  beforeEach(() => {
    wavefunction = new Superposition({
      Sum,
      Product,
      Constant,
    }).createWaveFunction()
  })

  it('should run', () => {
    const { Sum, Product } = wavefunction
    expect(Sum(9)).toBe(16)
    expect(Product(9)).toBe(63)
  })

  it('should be configurable before getting', () => {
    wavefunction.change({ Constant: () => 5 })
    const { Sum, Product } = wavefunction
    expect(Sum(9)).toBe(14)
    expect(Product(9)).toBe(45)
  })

  it('should be configurable after getting', () => {
    const { Sum, Product } = wavefunction
    wavefunction.change({ Constant: () => 5 })
    expect(Sum(9)).toBe(14)
    expect(Product(9)).toBe(45)
  })

  it('should not configurable after collapse', () => {
    const { Sum } = wavefunction
    expect(Sum(9)).toBe(16)
    expect(() => wavefunction.change({ Constant: () => 5 })).toThrow("Collapsed due to 'Sum' having been called.")
  })

  it('should not configurable after collapse', () => {
    const { Product } = wavefunction
    expect(Product(9)).toBe(63)
    expect(() => wavefunction.alter({ Constant: () => 5 })).toThrow("Collapsed due to 'Product' having been called.")
  })
})

describe('objects', () => {
  const Sum = ({ Constants }) => () => Constants.x + Constants.y
  const Product = ({ Constants }) => () => Constants.x * Constants.y
  const Constants = () => ({ x: 5, y: 7 })

  let system
  beforeEach(() => {
    system = new Superposition({
      Sum,
      Product,
      Constants
    })
  })

  it('should run', () => {
    const { Sum, Product } = system
    expect(Sum()).toBe(12)
    expect(Product()).toBe(35)
  })

  it('should be configurable before getting', () => {
    system.alter({ Constants: () => ({ x: 6, y: 8 }) })
    const { Sum, Product } = system
    expect(Sum()).toBe(14)
    expect(Product()).toBe(48)
  })

  it('should be configurable after getting', () => {
    const { Sum, Product } = system
    system.alter({ Constants: () => ({ x: 6, y: 8 }) })
    expect(Sum()).toBe(14)
    expect(Product()).toBe(48)
  })

  it('should collapse on property access', () => {
    const { Constants } = system
    expect(Constants.x).toBe(5)
    expect(() => system.alter({ Constants: () => ({ x: 6, y: 8 }) })).toThrow("Collapsed due to 'Constants' having been called.")
  })
})

describe('complex objects', () => {
  const Maths = ({ Constants }) => ({
    sum: () => Constants.x + Constants.y,
    product: () => Constants.x * Constants.y,
    identity: 1
  })
  const Constants = () => ({ x: 5, y: 7 })

  let system
  beforeEach(() => {
    system = new Superposition({
      Maths,
      Constants
    })
  })

  it('should run', () => {
    const { Maths } = system
    expect(Maths.sum()).toBe(12)
    expect(Maths.product()).toBe(35)
  })

  it('calling a function should collapse things', () => {
    const { Maths } = system
    expect(Maths.identity).toBe(1)
    expect(() => system.alter()).toThrow("Collapsed due to 'Maths' having been called.")
  })

  it('should allow Maths to be patched', () => {
    const { Maths } = system
    system.alter({Maths: ({ Constants }) => ({
      sum: () => Constants.x + Constants.x,
      product: () => Constants.y * Constants.y
    })})
    expect(Maths.sum()).toBe(10)
    expect(Maths.product()).toBe(49)
    expect(() => system.alter()).toThrow("Collapsed due to 'Maths' having been called.")
  })

})

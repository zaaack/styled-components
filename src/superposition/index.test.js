import Superposition from './index'

describe('basic', () => {
  const Sum = ({ Constant }) => value => Constant + value
  const Product = ({ Constant }) => value => Constant * value
  const Constant = 7

  let wavefunction
  beforeEach(() => {
    wavefunction = new Superposition({
      Constant,
    }, {
      Sum,
      Product,
    }).createWavefunction()
  })

  it('should run', () => {
    const { Sum, Product } = wavefunction
    expect(Sum(9)).toBe(16)
    expect(Product(9)).toBe(63)
  })

  it('should be configurable before getting', () => {
    wavefunction.modify({ Constant: 5 })
    const { Sum, Product } = wavefunction
    expect(Sum(9)).toBe(14)
    expect(Product(9)).toBe(45)
  })

  it('should be configurable after getting', () => {
    const { Sum, Product } = wavefunction
    wavefunction.modify({ Constant: 5 })
    expect(Sum(9)).toBe(14)
    expect(Product(9)).toBe(45)
  })

  it('should not configurable after collapse', () => {
    const { Sum } = wavefunction
    expect(Sum(9)).toBe(16)
    expect(() => wavefunction.modify({ Constant: 5 }))
      .toThrow("Collapsed due to 'Sum' having been called.")
  })

  it('should not configurable after collapse', () => {
    const { Product } = wavefunction
    expect(Product(9)).toBe(63)
    expect(() => wavefunction.modify({ Constant: 5 })).toThrow("Collapsed due to 'Product' having been called.")
  })

  it('should be cloneable and changes only affect one', () => {
    const other = wavefunction._superposition.createWavefunction()
    const { Product } = wavefunction
    const { Sum } = other
    wavefunction.modify({ Constant: 5 })
    expect(Sum(9)).toBe(16)
    expect(Product(9)).toBe(45)
  })

  it('should be cloneable after collapse', () => {
    const { Product } = wavefunction
    wavefunction.modify({ Constant: 5 })
    expect(Product(9)).toBe(45)
    const { Sum } = wavefunction._superposition.createWavefunction()
    expect(Sum(9)).toBe(16)
  })
})

describe('objects', () => {
  const Sum = ({ Constants }) => () => Constants.x + Constants.y
  const Product = ({ Constants }) => () => Constants.x * Constants.y
  const Constants = () => ({ x: 5, y: 7 })

  let wavefunction
  beforeEach(() => {
    wavefunction = new Superposition({
      Sum,
      Product,
      Constants
    }).createWavefunction()
  })

  it('should run', () => {
    const { Sum, Product } = wavefunction
    expect(Sum()).toBe(12)
    expect(Product()).toBe(35)
  })

  it('should be configurable before getting', () => {
    wavefunction.modify({ Constants: () => ({ x: 6, y: 8 }) })
    const { Sum, Product } = wavefunction
    expect(Sum()).toBe(14)
    expect(Product()).toBe(48)
  })

  it('should be configurable after getting', () => {
    const { Sum, Product } = wavefunction
    wavefunction.modify({ Constants: () => ({ x: 6, y: 8 }) })
    expect(Sum()).toBe(14)
    expect(Product()).toBe(48)
  })

  it('should collapse on property access', () => {
    const { Constants } = wavefunction
    expect(Constants.x).toBe(5)
    expect(() => wavefunction.modify({ Constants: () => ({ x: 6, y: 8 }) })).toThrow("Collapsed due to 'Constants' having been called.")
  })
})

describe('complex objects', () => {
  const Maths = ({ Constants }) => ({
    sum: () => Constants.x + Constants.y,
    product: () => Constants.x * Constants.y,
    identity: 1
  })
  const Constants = () => ({ x: 5, y: 7 })

  let wavefunction
  beforeEach(() => {
    wavefunction = new Superposition({
      Maths,
      Constants
    }).createWavefunction()
  })

  it('should run', () => {
    const { Maths } = wavefunction
    expect(Maths.sum()).toBe(12)
    expect(Maths.product()).toBe(35)
  })

  it('calling a function should collapse things', () => {
    const { Maths } = wavefunction
    expect(Maths.identity).toBe(1)
    expect(() => wavefunction.modify()).toThrow("Collapsed due to 'Maths' having been called.")
  })

  it('should allow Maths to be patched', () => {
    const { Maths } = wavefunction
    wavefunction.modify({
      Maths: ({ Constants }) => ({
        sum: () => Constants.x + Constants.x,
        product: () => Constants.y * Constants.y
      })
    })
    expect(Maths.sum()).toBe(10)
    expect(Maths.product()).toBe(49)
    expect(() => wavefunction.modify()).toThrow("Collapsed due to 'Maths' having been called.")
  })

})

describe('functions', () => {
  const Sum = ({ X, Y }) => {
    const sum = () => X + Y
    sum.something = 'here'
    return sum
  }
  const Product = ({ X, Y }) => class {
    constructor(z) {
      this.z = z
    }
    execute() {
      return X * Y * this.z
    }
  }
  const X = () => 5
  const Y = () => 3

  let wavefunction
  beforeEach(() => {
    wavefunction = new Superposition({
      Sum, X, Y, Product,
    }).createWavefunction()
  })

  it('should proxy things defined on functions and collapse', () => {
    const { Sum } = wavefunction
    expect(Sum.something).toEqual('here')
    expect(wavefunction._collapsed).toBeTruthy()
  })

  it('should proxy classes', () => {
    const { Product } = wavefunction
    const product = new Product(7)
    expect(product.execute()).toBe(105)
    expect(product.z).toBe(7)
  })
})

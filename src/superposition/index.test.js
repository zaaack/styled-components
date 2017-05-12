import Superposition from './index'

describe('basic', () => {
  const Sum = ({ Constant }) => value => Constant + value
  const Product = ({ Constant }) => value => Constant * value
  const Constant = () => 7

  let wavefunction
  beforeEach(() => {
    wavefunction = new Superposition({
      Constant,
      Sum,
      Product,
    }).createWavefunction()
  })

  it('should run', () => {
    const { Sum, Product } = wavefunction
    expect(Sum(9)).toBe(16)
    expect(Product(9)).toBe(63)
  })

  it('should explode if you dont give it a function', () => {
    expect(() => {
      wavefunction.modify({ Constant: 5 })
    }).toThrow("Every value must be a function of its dependencies! 'Constant' was a number.")
  })

  it('should explode if you dont give it a function', () => {
    expect(() => {
      new Superposition({ Constant: 5 })
    }).toThrow("Every value must be a function of its dependencies! 'Constant' was a number.")
  })

  it('should be configurable before getting', () => {
    wavefunction.modify({ Constant: () => 5 })
    const { Sum, Product } = wavefunction
    expect(Sum(9)).toBe(14)
    expect(Product(9)).toBe(45)
  })

  it('should allow replacing elements with dependencies too', () => {
    wavefunction.modify({
      Product: ({ Sum }) => value => Sum(0) * value,
      Constant: () => 12,
    })
    const { Product } = wavefunction
    expect(Product(11)).toBe(132)
  })

  it('should be configurable after getting', () => {
    const { Sum, Product } = wavefunction
    wavefunction.modify({ Constant: () => 5 })
    expect(Sum(9)).toBe(14)
    expect(Product(9)).toBe(45)
  })

  it('should not configurable after collapse', () => {
    const { Sum } = wavefunction
    expect(Sum(9)).toBe(16)
    expect(() => wavefunction.modify({ Constant: () => 5 }))
      .toThrow("Collapsed due to 'Sum' having been called.")
  })

  it('should not configurable after collapse', () => {
    const { Product } = wavefunction
    expect(Product(9)).toBe(63)
    expect(() => wavefunction.modify({ Constant: () => 5 })).toThrow("Collapsed due to 'Product' having been called.")
  })

  it('should be cloneable and changes only affect one', () => {
    const other = wavefunction.clone()
    const { Product } = wavefunction
    const { Sum } = other
    wavefunction.modify({ Constant: () => 5 })
    expect(Sum(9)).toBe(16)
    expect(Product(9)).toBe(45)
  })

  it('should be cloneable after collapse', () => {
    const { Product } = wavefunction
    wavefunction.modify({ Constant: () => 5 })
    expect(Product(9)).toBe(45)
    const { Sum } = wavefunction.clone()
    expect(Sum(9)).toBe(14)
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

describe('circles', () => {
  const A = ({ B }) => 1
  const B = ({ A }) => 2
  const C = () => 3
  const D = ({ A }) => 4
  const E = ({ F }) => 5
  const F = ({ G }) => 6
  const G = ({ E }) => 7

  let wavefunction
  beforeEach(() => {
    wavefunction = new Superposition({
      A, B, C, D, E, F, G
    }).createWavefunction()
  })

  it(`should work if the circular dependency isn't accessed`, () => {
    const { C } = wavefunction
    expect(C).toBe(3)
  })

  it(`should throw if circle is detected`, () => {
    expect(() => {
      const { A } = wavefunction
    }).toThrow("Circular dependency detected! Already accessed 'A' in dep chain A → B.")
  })

  it(`should throw if circle is detected`, () => {
    expect(() => {
      const { B } = wavefunction
    }).toThrow("Circular dependency detected! Already accessed 'B' in dep chain B → A.")
  })

  it(`should throw if circle is detected`, () => {
    expect(() => {
      const { D } = wavefunction
    }).toThrow("Circular dependency detected! Already accessed 'A' in dep chain D → A → B.")
  })

  it(`should throw if circle is detected`, () => {
    expect(() => {
      const { E } = wavefunction
    }).toThrow("Circular dependency detected! Already accessed 'E' in dep chain E → F → G.")
  })

  it(`should throw if circle is detected`, () => {
    expect(() => {
      const { G } = wavefunction
    }).toThrow("Circular dependency detected! Already accessed 'G' in dep chain G → E → F.")
  })

})

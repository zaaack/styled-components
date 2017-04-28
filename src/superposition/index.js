export default componentsRef => {
  const components = Object.assign({}, componentsRef)
  let collapsed = false

  const wavefunction = {}
  Object.keys(components).forEach(name => {
    Object.defineProperty(wavefunction, name, {
      enumerable: true,
      get() {
        const virtual = components[name](wavefunction)
        if (typeof virtual === "function") {
          return (...args) => {
            if (!collapsed) collapsed = name
            return components[name](wavefunction)(...args)
          }
        } else if (typeof virtual === "object") {
          return Object.create(virtual, Object.keys(virtual).reduce((defs, k) => {
            return {...defs, [k]: {
              enumerable: true,
              get() {
                if (!collapsed) collapsed = name
                return components[name](wavefunction)[k]
              }
            }}
          }, {}))
        } else {
          return virtual
        }
      }
    })
  })

  wavefunction.change = comps => {
    if (collapsed) throw new Error(`Collapsed due to '${collapsed}' having been called.`)
    return Object.assign(components, comps)
  }

  return wavefunction
}

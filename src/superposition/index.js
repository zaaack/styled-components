export default class Superposition {
  constructor(initialState) {
    this.initialState = initialState
  }

  createWavefunction() {
    const components = Object.assign({}, this.initialState)

    const wf = {
      _collapsed: false,
      _superposition: this,
      modify(comps) {
        if (this._collapsed) throw new Error(`Collapsed due to '${this._collapsed}' having been called.`)
        return Object.assign(components, comps)
      }
    }

    Object.keys(components).forEach(name => {
      Object.defineProperty(wf, name, {
        enumerable: true,
        get() {
          const virtual = components[name](wf)
          if (typeof virtual === 'function') {
            const proxyfunc = (...args) => {
              if (!wf._collapsed) wf._collapsed = name
              return components[name](wf)(...args)
            }
            Object.keys(virtual).forEach(k => {
              Object.defineProperty(proxyfunc, k, {
                enumerable: true,
                get() {
                  if (!wf._collapsed) wf._collapsed = name
                  return components[name](wf)[k]
                },
              })
            })
            return proxyfunc
          } else if (typeof virtual === 'object') {
            return Object.create(virtual, Object.keys(virtual).reduce((defs, k) => ({
              ...defs,
              [k]: {
                enumerable: true,
                get() {
                  if (!wf._collapsed) wf._collapsed = name
                  return components[name](wf)[k]
                },
              },
            }), {}))
          } else {
            return virtual
          }
        },
      })
    })

    return wf
  }
}

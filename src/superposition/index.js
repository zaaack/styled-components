export default class Superposition {
  constructor(constants, variables) {
    if (variables) {
      this.constants = constants
      this.variables = variables
    } else {
      this.constants = {}
      this.variables = constants
    }
  }

  createWavefunction() {
    const components = Object.assign({}, this.variables)

    const wf = {
      _collapsed: false,
      _superposition: this,
      modify(comps) {
        if (this._collapsed) throw new Error(`Collapsed due to '${this._collapsed}' having been called.`)
        Object.keys(comps).forEach(name => {
          if (components[name] !== undefined) {
            components[name] = comps[name]
          } else {
            wf[name] = comps[name]
          }
        })
        return components
      },
    }
    console.log(this.constants)
    Object.keys(this.constants).forEach(name => {
      wf[name] = this.constants[name]
    })

    Object.keys(components).forEach(name => {
      Object.defineProperty(wf, name, {
        enumerable: true,
        get() {
          console.log(name)
          console.log(Object.keys(wf))
          const virtual = components[name](wf)
          if (typeof virtual === 'function') {
            function proxyfunc(...args) {
              if (!wf._collapsed) wf._collapsed = name
              const targetFunc = components[name](wf)
              /* If we called proxyfunc with new, call
               * targetFunc with new. */
              return this instanceof proxyfunc
                ? new targetFunc(...args)
                : targetFunc(...args)
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

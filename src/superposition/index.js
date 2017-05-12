function checkType(obj, k) {
  if (typeof obj[k] !== 'function') {
    throw new Error(
      `Every value must be a function of its dependencies! '${k}' was a ${typeof obj[k]}.`,
    )
  }
}

export default class Superposition {
  constructor(initialState) {
    Object.keys(initialState).forEach(name => checkType(initialState, name))
    this.initialState = initialState
  }

  createWavefunction() {
    const components = Object.assign({}, this.initialState)

    const wf = {
      _collapsed: false,
      clone() {
        return new Superposition(Object.assign({}, components)).createWavefunction()
      },
      modify(comps) {
        if (this._collapsed) throw new Error(`Collapsed due to '${this._collapsed}' having been called.`)
        Object.keys(comps).forEach(name => {
          checkType(comps, name)
          components[name] = comps[name]
        })
        return components
      },
    }

    let depth = 0
    const stack = {}
    Object.keys(components).forEach(name => {
      Object.defineProperty(wf, name, {
        enumerable: true,
        get() {
          if (stack[name] !== undefined) {
            throw new Error(
            `Circular dependency detected! Already accessed '${name}' in dep chain ${
              Object.keys(stack).sort((a, b) => stack[a] - stack[b]).join(' → ')
            }.`,
          )
          }

          function resolveDeps() {
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
          }

          stack[name] = depth++
          const retVal = resolveDeps()
          depth--
          delete stack[name]
          return retVal
        },
      })
    })

    return wf
  }
}

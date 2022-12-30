import Vue from '../src/instance'
import { observe } from '../src/observer'

describe('Observer', () => {
  it('create on non-observables', () => {
    // skip primitive value
    const ob1 = observe(1)
    expect(ob1).toBeUndefined()
    // avoid vue instance
    const ob2 = observe(new Vue())
    expect(ob2).toBeUndefined()
    // avoid frozen objects
    const ob3 = observe(Object.freeze({}))
    expect(ob3).toBeUndefined()
  })
})

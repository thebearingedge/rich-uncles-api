import foo from '.'
import { expect } from './test'

describe('foo()', () => {

  it('returns a string', () => {
    const result = foo()
    expect(result).to.be.a('string')
    expect(result).to.have.structure(String)
  })

})

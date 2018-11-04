import Substore from './'

describe('Substore', () => {
  let substore

  beforeEach(() => {
    substore = new Substore({ prefix: 'prefix/' })
  })

  it('requires responseMap to handle null argument', () => {
    const buildSubstoreWithInvalidResponseMap = () =>
      new Substore({
        responseMap: response => ({ data: response.property }),
      })

    expect(buildSubstoreWithInvalidResponseMap).toThrow()
  })

  it('sets initialState by calling responseMap(null)', done => {
    new Substore({
      responseMap: response => {
        expect(response).toBeNull()
        done()
      },
    })
  })

  it('builds a set of action types', () => {
    expect(substore.ACTION_TYPE).toHaveProperty('CLEAR', 'prefix/CLEAR')
    expect(substore.ACTION_TYPE).toHaveProperty('REQUEST', 'prefix/REQUEST')
    expect(substore.ACTION_TYPE).toHaveProperty('FAILURE', 'prefix/REQUEST_FAILURE')
    expect(substore.ACTION_TYPE).toHaveProperty('SUCCESS', 'prefix/REQUEST_SUCCESS')
  })

  it('defines action creators', () => {
    expect(typeof substore.requestAction).toEqual('function')
    expect(typeof substore.clearAction).toEqual('function')
    expect(typeof substore.failureAction).toEqual('function')
    expect(typeof substore.successAction).toEqual('function')
  })
})

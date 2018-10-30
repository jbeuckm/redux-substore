import Substore from './'

describe('Substore', () => {
  let substore

  beforeEach(() => {
    substore = new Substore({ prefix: 'PREFIX' })
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
    expect(substore.ACTION_TYPE).toHaveProperty('CLEAR', 'CLEAR_PREFIX')
    expect(substore.ACTION_TYPE).toHaveProperty('REQUEST', 'REQUEST_PREFIX')
    expect(substore.ACTION_TYPE).toHaveProperty('FAILURE', 'REQUEST_PREFIX_FAILURE')
    expect(substore.ACTION_TYPE).toHaveProperty('SUCCESS', 'REQUEST_PREFIX_SUCCESS')
  })

  it('defines action creators', () => {
    expect(typeof substore.requestAction).toEqual('function')
    expect(typeof substore.clearAction).toEqual('function')
    expect(typeof substore.failureAction).toEqual('function')
    expect(typeof substore.successAction).toEqual('function')
  })
})

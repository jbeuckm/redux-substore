import RequestSubstore from './'

describe('RequestSubstore reducer', () => {
  const substore = new RequestSubstore({ prefix: 'REQUEST_STUFF' })

  it('sets initialState', () => {
    expect(substore.initialState).not.toBeNull()
  })

  it('sets initialState when cleared', () => {
    const initialState = {
      data: 'abc',
    }
    const modifiedState = substore.reducer(initialState, substore.clearAction())
    expect(modifiedState.data).toBeNull()
  })

  it('sets isLoading when requestAction', () => {
    const initialState = {
      isLoading: false,
    }
    const modifiedState = substore.reducer(initialState, substore.requestAction())
    expect(modifiedState.isLoading).toBeTruthy()
  })

  it('sets error when failureAction', () => {
    const initialState = {
      isLoading: false,
    }
    const modifiedState = substore.reducer(initialState, substore.failureAction('error'))
    expect(modifiedState.isLoading).toBeFalsy()
    expect(modifiedState.error).toEqual('error')
  })

  it('sets data when successAction', () => {
    const initialState = {
      isLoading: false,
    }
    const modifiedState = substore.reducer(initialState, substore.successAction('data'))
    expect(modifiedState.isLoading).toBeFalsy()
    expect(modifiedState.data).toEqual('data')
  })
})

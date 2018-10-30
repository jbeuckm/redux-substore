import { ActionsObservable } from 'redux-observable'
import 'rxjs/add/operator/toArray'
import Substore from './'

describe('Substore epic', () => {
  let substore, action$

  beforeEach(() => {
    substore = new Substore({ prefix: 'REQUEST_STUFF' })
    substore.failureAction = jest.fn()
    substore.successAction = jest.fn()
    action$ = ActionsObservable.of(substore.requestAction())
  })

  it('fails when a promise-returning function rejects', done => {
    substore.promiseFunction = () => Promise.reject()

    substore
      .epic(action$)
      .toArray()
      .subscribe(outputs => {
        expect(substore.failureAction).toHaveBeenCalled()
        done()
      })
  })

  it('succeeds when a promise-returning function resolves', done => {
    substore.promiseFunction = () => Promise.resolve()

    substore
      .epic(action$)
      .toArray()
      .subscribe(outputs => {
        expect(substore.successAction).toHaveBeenCalled()
        done()
      })
  })

  it('fails when a callback function reports an error', done => {
    substore.callbackFunction = callback => callback('error')

    substore
      .epic(action$)
      .toArray()
      .subscribe(outputs => {
        expect(substore.failureAction).toHaveBeenCalled()
        done()
      })
  })

  it('succeeds when a callback function succeeds', done => {
    substore.callbackFunction = callback => callback(null, 'abc123')

    substore
      .epic(action$)
      .toArray()
      .subscribe(outputs => {
        expect(substore.successAction).toHaveBeenCalled()
        done()
      })
  })
})

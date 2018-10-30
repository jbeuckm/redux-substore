import * as most from 'most'
import { select } from 'redux-most'
import { run } from 'most-test'

const expectEpicActions = ({ epic, store, incomingActions, expectedActions, tick }) => {
  if (tick) {
    jest.useRealTimers() // this is required for web tests

    return run(epic(most.from(incomingActions), store))
      .tick(tick)
      .then(result => {
        expect(stringifyWhitelists(result.events)).toEqual(stringifyWhitelists(expectedActions))
      })
  }

  return epic(most.from(incomingActions), store)
    .reduce((acc, next) => acc.concat(next), [])
    .then(result => {
      expect(stringifyWhitelists(result)).toEqual(stringifyWhitelists(expectedActions))
    })
}

import Substore from './'

describe('Substore epic', () => {
  let epic, substore, action$

  beforeEach(() => {
    substore = new Substore({ prefix: 'REQUEST_STUFF' })
    substore.failureAction = jest.fn()
    substore.successAction = jest.fn()
    action$ = most.of(substore.requestAction())
  })

  it('fails when a promise-returning function rejects', done => {
    substore.promiseFunction = () => Promise.reject()

    substore
      .epic(action$)
      .reduce((acc, next) => acc.concat(next), [])
      .then(result => {
        expect(substore.failureAction).toHaveBeenCalled()
        done()
      })
  })

  it('succeeds when a promise-returning function resolves', done => {
    substore.promiseFunction = () => Promise.resolve()

    substore
      .epic(action$)
      .reduce((acc, next) => acc.concat(next), [])
      .then(result => {
        expect(substore.successAction).toHaveBeenCalled()
        done()
      })
  })

  it('fails when a callback function reports an error', done => {
    substore.callbackFunction = callback => callback('error')

    substore
      .epic(action$)
      .reduce((acc, next) => acc.concat(next), [])
      .then(result => {
        expect(substore.failureAction).toHaveBeenCalled()
        done()
      })
  })

  it('succeeds when a callback function succeeds', done => {
    substore.callbackFunction = callback => callback(null, 'abc123')

    substore
      .epic(action$)
      .reduce((acc, next) => acc.concat(next), [])
      .then(result => {
        expect(substore.successAction).toHaveBeenCalled()
        done()
      })
  })
})

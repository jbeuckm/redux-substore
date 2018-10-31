import * as most from 'most'
import { select, fromPromise } from 'redux-most'
import { promisify } from 'es6-promisify'

class Substore {
  constructor({ prefix, promiseFunction, callbackFunction, initialState, responseMap }) {
    this.prefix = prefix
    this.promiseFunction = promiseFunction
    this.callbackFunction = callbackFunction
    this.responseMap = responseMap || (response => ({ data: response }))

    try {
      this.initialState = {
        ...this.responseMap(null),
        isLoading: false,
        error: null,
      }
    } catch (error) {
      const header = `Substore[${this.prefix}]:`
      throw `${header} responseMap() must return an initial state when the argument is null.`
    }
  }

  get ACTION_TYPE() {
    return {
      REQUEST: `${this.prefix}_REQUEST`,
      CLEAR: `${this.prefix}_CLEAR`,
      FAILURE: `${this.prefix}_REQUEST_FAILURE`,
      SUCCESS: `${this.prefix}_REQUEST_SUCCESS`,
    }
  }

  clearAction = () => ({ type: this.ACTION_TYPE.CLEAR })

  requestAction = payload => ({ type: this.ACTION_TYPE.REQUEST, payload })

  failureAction = error => ({
    type: this.ACTION_TYPE.FAILURE,
    payload: error,
    error: true,
  })

  successAction = payload => ({
    type: this.ACTION_TYPE.SUCCESS,
    payload,
  })

  reducer = (state = this.initialState, { type, payload }) => {
    switch (type) {
      case this.ACTION_TYPE.REQUEST:
        return { ...state, isLoading: true, error: null }

      case this.ACTION_TYPE.FAILURE:
        return { ...this.responseMap(null), isLoading: false, error: payload }

      case this.ACTION_TYPE.SUCCESS:
        return {
          ...state,
          isLoading: false,
          error: false,
          ...this.responseMap(payload),
        }

      case this.ACTION_TYPE.CLEAR:
        return {
          ...this.initialState,
        }

      default:
        return state
    }
  }

  epic = action$ => {
    const _this = this

    return action$.thru(select(this.ACTION_TYPE.REQUEST)).flatMap(({ payload }) => {
      const requestFunction = _this.promiseFunction || promisify(_this.callbackFunction)

      return most
        .fromPromise(requestFunction.apply(_this, payload ? [payload] : null))
        .flatMap(response => most.of(_this.successAction(response)))
        .recoverWith(error => most.of(_this.failureAction(error)))
    })
  }
}

export default Substore

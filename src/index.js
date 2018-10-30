import { mergeMap } from 'rxjs/operators'
import { combineEpics, ofType, fromPromise } from 'redux-observable'
import { promisify } from 'es6-promisify'

class RequestSubstore {
  constructor({ prefix, promiseFunction, callbackFunction, initialState, responseMap }) {
    this.prefix = prefix
    this.promiseFunction = promiseFunction
    this.callbackFunction = callbackFunction
    this.responseMap = responseMap || (response => ({ data: response }))

    try {
      this.initialState = { ...this.responseMap(null), isLoading: false, error: null }
    } catch (error) {
      const header = `RequestSubstore[${this.prefix}]:`
      throw `${header} responseMap() must return an initial state when the argument is null.`
    }
  }

  get ACTION_TYPE() {
    return {
      REQUEST: `REQUEST_${this.prefix}`,
      CLEAR: `CLEAR_${this.prefix}`,
      FAILURE: `REQUEST_${this.prefix}_FAILURE`,
      SUCCESS: `REQUEST_${this.prefix}_SUCCESS`,
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

  epic = action$ =>
    action$.pipe(
      ofType(this.ACTION_TYPE.REQUEST),
      mergeMap(({ payload }) => {
        return (this.promiseFunction || promisify(this.callbackFunction))
          .apply(this, payload ? [payload] : null)
          .then(this.successAction)
          .catch(this.failureAction)
      })
    )
}

export default RequestSubstore

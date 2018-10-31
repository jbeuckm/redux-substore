import { combineReducers, createStore, applyMiddleware } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-most'
import Substore from './index'
import { diff } from 'deep-object-diff'

const goodDataSubstore = new Substore({
  prefix: 'GOOD_DATA',
  promiseFunction: () => Promise.resolve('🎁'),
})

const badDataSubstore = new Substore({
  prefix: 'BAD_DATA',
  callbackFunction: err => err('🔥'),
})

const rootReducer = combineReducers({
  goodData: goodDataSubstore.reducer,
  badData: badDataSubstore.reducer,
})

const logger = store => next => action => {
  console.log('DISPATCH', action)

  const oldState = store.getState()
  let result = next(action)
  const newState = store.getState()

  console.log('STATE DIFF -->', diff(oldState, newState), '\n')
  return result
}

const rootEpic = combineEpics([goodDataSubstore.epic, badDataSubstore.epic])

const epicMiddleware = createEpicMiddleware(rootEpic)

const store = createStore(rootReducer, applyMiddleware(logger, epicMiddleware))

const demoActions = [
  goodDataSubstore.requestAction(),
  goodDataSubstore.clearAction(),
  badDataSubstore.requestAction(),
  badDataSubstore.clearAction(),
]

let delay = 0
demoActions.forEach(action => setTimeout(() => store.dispatch(action), 1000 * delay++))

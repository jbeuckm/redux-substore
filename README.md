# redux-substore

[![Build Status](https://travis-ci.org/jbeuckm/redux-substore.svg?branch=master)](https://travis-ci.org/jbeuckm/redux-substore)

Collected actions, reducer, epic and state for an async request.

### How to use it:

Create a new __Substore__ that will manage the `getMyData` request function.

in __myDataSubstore.js__...

```
import Substore from 'redux-substore'

export default new Substore({
  prefix: 'MY_PREFIX',
  promiseFunction: args => getMyData(args),
  responseMap: response => response['keyWhereMyDataIs'],
})
```

The __PREFIX__ will be used to label the action types for this substore. The function `promiseFunction` must return a promise that will resolve with the data or reject with an error. Alternatively, send `callbackFunction` with a Node style callback `function(err, data)`. The function `responseMap` will receive whatever the request function resolves or calls back with and should generate the state. `responseMap` should generate the initialState for the substore when it receives `null`.

Add the reducer and epic to your `combineReducers` and `combineEpics`:

```
import { combineReducers } from 'redux'

combineReducers({
	...
	myData: myDataSubstore.reducer
})
```
```
import { combineEpics } from 'redux-most'

combineEpics([
	...
	myDataSubstore.epic
])
```

Then trigger the request by dispatching the `requestAction`

```
store.dispatch(mySubstore.requestAction())
```

The action has type __MY\_PREFIX\_REQUEST__ and when it completes, __MY\_PREFIX\_REQUEST\_SUCCESS__ or __MY\_PREFIX\_REQUEST\_FAILURE__ will be dispatched accordingly.

Access the data or status of the substore by selecting the key you assigned in `combineReducers`:

`getState().myData.isLoading`

`getState().myData.error`

`getState().myData.data` *(default responseMap sets this key)*

If you need to clear the data in the __Substore__, dispatch `mySubstore.clear()`.

# redux-rereducers
A higher order reducer for performing state calculations after the initial reduction has completed.


## Benefits
- Easier to reduce data that depends on multiple state values in the redux store.
- Processes all changes within the same reduction preventing state inconsistencies normally caused by side effects pattern.   
- Cleanly decouple reductions based on data that may be affected by multiple actions.
- No need to replicate reductions in several action reducers.


## Build Status
[![npm version](https://badge.fury.io/js/redux-rereducers.svg)](https://badge.fury.io/js/redux-rereducers)<br />
[![Build Status](https://travis-ci.org/brianneisler/redux-rereducers.svg)](https://travis-ci.org/brianneisler/redux-rereducers)<br />
[![NPM](https://nodei.co/npm/redux-rereducers.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/redux-rereducers/)


## Install
```js
npm install --save redux-rereducers
```


## Usage
```js
import { createStore } from 'redux'
import { applyHigherOrders } from 'redux-higher-orders'
import { createRereducerHigherOrder } from 'redux-rereducers'

const rereducers = [
  (state) => {
    ...state
  },
  rereducer2,
  rereducerN
]

let store = createStore(
  reducer,
  initialState,
  applyHigherOrders(
    createRereducerHigherOrder(rereducers)
  )
)
```


### `createRereducerHigherOrder(...rereducers)`
Creates a higher order reducer that applies the rereducers after the initial primary reduction has been performed.


#### Arguments
* `...rereducers` (*arguments*): Functions that conform to the *rereducers API*. Each rereducer receives the `state` only and returns `state`. The rereducer signature is `(state) => state`.


#### Returns
* `Function` A higher order reducer that applies the given rereducers.


#### Example: Average of Multiple Increment Counters

```js
import { createStore } from 'redux'
import { handleActions } from 'redux-actions'
import { applyHigherOrders } from 'redux-higher-orders'
import { createRereducerHigherOrder } from 'redux-rereducers'

const reducer = handleActions({
  INCREMENT: (state, action) => ({
    counters: {
      ...state.counters,
      [action.payload]: state.counters[action.payload] + 1
    }
  }),

  DECREMENT: (state, action) => ({
    counters: {
      ...state.counters,
      [action.payload]: state.counters[action.payload] - 1
    }
  })
}, { counters: {}, average: 0 })


const rereducer = (state) => ({
  ...state,
  average: calculateAverage(state.counters)
})

const store = createStore(
  reducer,
  initialState,
  applyHigherOrders(
    createRereducerHigherOrder([rereducer])
  )
)

store.dispatch({
  type: 'INCREMENT',
  payload: 'a'
})

store.dispatch({
  type: 'INCREMENT',
  payload: 'b'
})

store.getState()  // { counters: { a: 1, b: 1 }, average: 1 }
```

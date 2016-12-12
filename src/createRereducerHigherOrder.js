import _ from 'mudash'

export default function createRereducerHigherOrder(rereducers = []) {
  const rereducer = _.reduceReducers(...rereducers)
  return reducer => (state, action) => {
    let prevState = state
    state = reducer(state, action)
    while (!_.eq(prevState, state)) {
      prevState = state
      state = rereducer(state)
    }
    return state
  }
}

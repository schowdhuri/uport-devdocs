import { createStore as reduxCreateStore } from 'redux'

const initialState = { profile: {} }
const reducer = (state, action) => {
  if (action.type === `SAVE_PROFILE`) {
    return Object.assign({}, state, {
      profile: action.profile
    })
  }
  return state
}

const createStore = () => reduxCreateStore(reducer, initialState)
export default createStore

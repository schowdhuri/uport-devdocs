import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'profile',
  storage
}

const initialState = {
  profile: {},
  currentApp: {name: '', configuration: {network: 'mainnet', accountType: 'keypair'}}
}

const reducer = (state = initialState, action) => {
  if (action.type === `SAVE_PROFILE`) {
    return Object.assign({}, state, {
      profile: action.profile
    })
  }
  if (action.type === `SET_CURRENT_APP`) {
    return Object.assign({}, state, {
      currentApp: action.app
    })
  }
  if (action.type === `CLEAR_CURRENT_APP`) {
    return Object.assign({}, state, {
      currentApp: initialState.currentApp
    })
  }
  if (action.type === `SAVE_APPS`) {
    return Object.assign({}, state, {
      profile: {...state.profile, uportApps: action.uportApps}
    })
  }
  return state
}
const persistedReducer = persistReducer(persistConfig, reducer)
export default () => {
  let store = createStore(persistedReducer)
  let persistor = persistStore(store)
  return { store, persistor }
}

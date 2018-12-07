import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const initialState = {
  profile: {},
  currentApp: {
    name: '',
    configuration: {
      network: 'mainnet',
      accountType: 'keypair'
    }
  }
}

export const reducer = (state = initialState, action) => {
  if (action.type === `SAVE_PROFILE`) {
    return {
      ...state,
      profile: action.profile
    }
  }
  if (action.type === `SET_CURRENT_APP`) {
    return {
      ...state,
      currentApp: action.app
    }
  }
  if (action.type === `CLEAR_CURRENT_APP`) {
    return {
      ...state,
      currentApp: initialState.currentApp
    }
  }
  if (action.type === `SAVE_APPS`) {
    return {
      ...state,
      profile: {
        ...state.profile,
        uportApps: action.uportApps
      }
    }
  }
  if (action.type === `LOGOUT`) {
    return {
      ...state,
      profile: initialState.profile,
      currentApp: initialState.currentApp
    }
  }
  return state
}

const persistConfig = {
  key: 'profile',
  storage
}

export const persistedReducer = persistReducer(persistConfig, reducer)

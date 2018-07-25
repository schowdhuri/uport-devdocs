import React from 'react'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'

import configureStore from './src/state/configureStore'

const store = configureStore().store

export const replaceRouterComponent = ({ history }) => {
  const ConnectedRouterWrapper = ({ children }) => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  )
  return ConnectedRouterWrapper
}

import React from 'react'
import { Router } from 'react-router-dom'
import { Provider } from 'react-redux'
import createMiddleware from 'redux-saga'
import 'babel-polyfill'
import history from './src/utilities/history'
import configureStore from './src/state/configureStore'

const store = configureStore().store

export const replaceRouterComponent = () => {
  const ConnectedRouterWrapper = ({ children }) => (
    <Provider store={store}>
      <Router history={history}>{children}</Router>
    </Provider>
  )
  return ConnectedRouterWrapper
}

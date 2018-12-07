import { createStore, applyMiddleware, compose } from 'redux'

export default (reducer, sagaMiddleware) => createStore(
  reducer,
  window.devToolsExtension
    ? compose(applyMiddleware(sagaMiddleware),  window.devToolsExtension())
    : applyMiddleware(sagaMiddleware))
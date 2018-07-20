import React from 'react'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import configureStore from './src/state/configureStore'

export const replaceRenderer = ({ bodyComponent, replaceBodyHTMLString }) => {
  const store = configureStore().store
  const ConnectedBody = () => (
    <Provider store={store}>
      {bodyComponent}
    </Provider>
  )
  replaceBodyHTMLString(renderToString(<ConnectedBody />))
}

import { createMemoryHistory, createBrowserHistory } from 'history'

const history = typeof(window)!=='undefined'
  ? createBrowserHistory()
  : createMemoryHistory()

export default history
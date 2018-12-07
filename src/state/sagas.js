import { spawn } from 'redux-saga/effects'
import logout from './logoutSaga'

function* rootSaga() {
  yield spawn(logout)
}

export default rootSaga

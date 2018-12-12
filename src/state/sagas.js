import { spawn } from 'redux-saga/effects'
import logout from './logoutSaga'
import featureFlags from './featureFlagSaga'

function* rootSaga() {
  yield spawn(featureFlags)
  yield spawn(logout)
}

export default rootSaga

import { call, put, takeEvery } from 'redux-saga/effects'
import getFeatureFlags from './getFeatureFlags'

function* featureFlagSaga() {
  yield takeEvery('GET_FEATURE_FLAGS', function*() {
    try {
      const flags = yield call(getFeatureFlags)
      yield put({
        type: 'GET_FEATURE_FLAGS_OK',
        value: flags
      })
    } catch(ex) {
      console.log(ex)
      yield put({
        type: 'GET_FEATURE_FLAGS_ERR',
        error: ex
      })
    }
  })
}

export default featureFlagSaga

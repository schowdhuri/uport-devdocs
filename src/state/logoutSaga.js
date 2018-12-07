import { takeEvery } from 'redux-saga/effects'
import history from '../utilities/history'

function* onLogout() {
  yield takeEvery('LOGOUT', function() {
    history.push('/')
  });
}

export default onLogout

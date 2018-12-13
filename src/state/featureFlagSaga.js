import { call, put, takeEvery } from 'redux-saga/effects'

const PUBLIC_URL = 'https://s3-us-west-2.amazonaws.com/uport-devx-config/featureFlags.json'

const getEnv = () => {
  const envPatterns = [
    [ /^https?:\/\/developer\.uport\.me/, 'production' ],
    [ /^https?:\/\/developer\.uport\.space/, 'stage' ],
    [ /^http:\/\/localhost/, 'development' ],
  ]
  let env = envPatterns.find(url =>
    url[0].test(window.location.href))
  if(!env)
    env = envPatterns.find(url => url[1] === 'production')
  return env[1]
}

const fetchFlags = async () => {
  const response = await fetch(PUBLIC_URL, {
    method: 'get',
    headers: {
      'Accept': 'application/json'
    }
  })
  if(response.ok) {
    return await response.json()
  } else {
    if(typeof(response.text) === "function") {
      const text = await response.text()
      throw new Error(text)
    } else {
      throw new Error(response)
    }
  }
}

const getFeatureFlags = async () => {
  const flags = await fetchFlags()
  const env = getEnv()
  return flags[env] || flags['production']
}

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

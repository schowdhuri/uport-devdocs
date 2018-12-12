const hitFlagAPI = async () => {
  const res = fetch('https://s3-us-west-2.amazonaws.com/uport-devx-config/features.json', {
    method: 'get',
    headers: {
      'Accept': 'application/json'
    }
  })
  if(res.ok) {
    return await res.json()
  } else {
    if(typeof(res.text) === "function") {
      return await res.text()
    } else {
      return res
    }
  }
}

module.exports = hitFlagAPI

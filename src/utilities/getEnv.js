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

export default getEnv

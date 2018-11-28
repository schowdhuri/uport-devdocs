export default (event, props={}, options={}) => {
  analytics.track(event, props, {
    ...options,
    context: {
      ip: '0.0.0.0'
    }
  })
}

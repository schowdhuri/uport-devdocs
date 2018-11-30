export const trackPage = (name, props={}) => {
  analytics.track(name, props, {
    context: {
      ip: '0.0.0.0'
    }
  })
}

export default (event, props={}, options={}) => {
  analytics.track(event, props, {
    ...options,
    context: {
      ip: '0.0.0.0'
    }
  })
}

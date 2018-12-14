import React from 'react'
import { connect } from 'react-redux'

const Flagged = props => {
  const { children, name, flags } = props
  return flags[name]
    ? children
    : null
}

const mapStateToProps = state => ({
  flags: state.featureFlags
})

const mergeProps = (stateProps, dispatchProps, ownProps) => ({
  ...stateProps,
  ...dispatchProps,
  ...ownProps
})

export default connect(mapStateToProps, undefined, mergeProps)(Flagged)

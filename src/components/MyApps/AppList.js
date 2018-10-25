import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import myAppsBg from '../../images/myapps-bg.svg'

class AppList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      bgImageStyles: []
    }
  }
  async componentDidMount () {
    let bgImageArray = this.state.bgImageStyles
    await this.props.profile.uportApps.map((app, index) => {
      if (app.configuration.profile) {
        let profileClaim = 'https://ipfs.io' + app.configuration.profile['/']
        let that = this
        fetch(profileClaim).then(function (response) {
          if (response.status >= 400) { console.log('Bad response from IPFS') }
          return response.json()
        }).then(function (data) {
          let profileImageUrl
          if (data.profileImage) {
            profileImageUrl = 'https://ipfs.io' + data.profileImage['/']
            bgImageArray[index] = {backgroundImage: `url(${profileImageUrl})`}
            that.setState({bgImageStyles: bgImageArray})
            return {backgroundImage: `url(${profileImageUrl})`}
          } else {
            return {backgroundImage: `url(${myAppsBg})`}
          }
        })
      } else {
        bgImageArray[index] = {backgroundImage: `url(${myAppsBg})`}
        return {backgroundImage: `url(${myAppsBg})`}
      }
    })
  }
  handleAppItemClick (event, index) {
    this.props.clearCurrentApp()
    this.props.setCurrentApp(this.props.profile.uportApps[index])
    this.props.history.push('/myapps/detail')
  }
  render () {
    const appItems = this.props.profile.uportApps.map((app, index) => {
      return (<li className='appItem' key={index} onClick={(e) => { this.handleAppItemClick(e, index) }}>
        <div className='appCover' style={{backgroundColor: app.configuration.accentColor || '#5c54c7'}}>&nbsp;</div>
        <div className={'avatar ' + (app.configuration.profile ? 'uploaded' : 'default')} style={this.state.bgImageStyles[index]}>
          &nbsp;
        </div>
        <h3>{app.name}</h3>
        <span>{app.configuration.network}</span>
      </li>
      )
    })
    return (
      <ul className='appList'>{appItems}</ul>
    )
  }
}

AppList.propTypes = {
  profile: PropTypes.object.isRequired,
  setCurrentApp: PropTypes.func.isRequired,
  clearCurrentApp: PropTypes.func.isRequired
}

const mapStateToProps = ({ profile, currentApp }) => {
  return { profile, currentApp }
}

const mapDispatchToProps = dispatch => {
  return {
    setCurrentApp: (app) => dispatch({ type: `SET_CURRENT_APP`, app: app }),
    clearCurrentApp: () => dispatch({ type: `CLEAR_CURRENT_APP` })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppList)

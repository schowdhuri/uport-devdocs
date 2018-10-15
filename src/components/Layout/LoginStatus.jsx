import React, {Component} from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Connect } from 'uport-connect'
import onClickOutside from 'react-onclickoutside'

class LoginStatus extends Component {
  constructor (props) {
    super(props)
    this.state = {
      visible: false
    }
    this.toggleMenu = this.toggleMenu.bind(this)
    this.loginRequest = this.loginRequest.bind(this)
  }
  toggleMenu (e) {
    e.preventDefault()
    this.setState({visible: !this.state.visible})
  }
  handleClickOutside (e) {
    this.setState({visible: false})
  }
  loginRequest (e) {
    e.preventDefault()
    try {
      const uPortConnect = new Connect('MyApps')
      uPortConnect.requestDisclosure({requested: ['name'], verified: ['uport-apps'], notifications: true})
      uPortConnect.onResponse('disclosureReq').then(response => {
        this.props.saveProfile({name: response.payload.name, did: response.payload.did, uportApps: response.payload['uport-apps']})
      })
    } catch (e) {
      console.log(e)
    }
  }
  render () {
    let appItems
    if (this.props.profile.uportApps) {
      appItems = this.props.profile.uportApps.map((app, index) =>
        <li key={index} onClick={() => { this.props.setCurrentApp(this.props.profile.uportApps[index]) }}><a href='/myapps/detail'>{app.name}</a></li>
      )
    }
    return (
      <div className='loginStatus'>
        { Object.keys(this.props.profile).length === 0
        ? <div>
          <a href='#' className={`nav-link w-nav-link`} onClick={(e) => { this.loginRequest(e) }}>Log In</a>
          <a href='/myapps' className={`nav-link w-nav-link register-app`}>Register Your App</a>
        </div>
        : <div>
          <a href='#' className={`nav-link w-nav-link myapps-nav`} onClick={(e) => { this.toggleMenu(e) }}>MyApps</a>
          {this.state.visible &&
            <ul className='myAppsDropdown'>
              {this.props.profile.uportApps ? appItems : null}
              <li className='logout' onClick={() => { this.props.logout() }}><a href='#'>Logout</a></li>
            </ul>
          }
        </div>
        }
      </div>
    )
  }
}

LoginStatus.propTypes = {
  profile: PropTypes.object.isRequired,
  saveProfile: PropTypes.func.isRequired,
  setCurrentApp: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired
}

const mapStateToProps = ({ profile }) => {
  return { profile }
}

const mapDispatchToProps = dispatch => {
  return {
    saveProfile: (profile) => dispatch({ type: `SAVE_PROFILE`, profile: profile }),
    setCurrentApp: (app) => dispatch({ type: `SET_CURRENT_APP`, app: app }),
    logout: () => dispatch({type: `LOGOUT`})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(LoginStatus))

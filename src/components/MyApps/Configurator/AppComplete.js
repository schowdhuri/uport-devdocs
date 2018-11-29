import React, { Component } from 'react'
import { uPortConnect } from '../../../utilities/uPortConnectSetup'

class AppComplete extends Component {
  componentDidMount () {
    let uportApps = this.props.profile.uportApps || {}
    let claim = {
      name: this.props.appDetails.appName,
      configuration: {
        network: this.props.appEnvironment.network,
        accentColor: this.props.appDetails.accentColor,
        profile: {'/': '/ipfs/' + this.props.ipfsProfileHash}
      }
    }
    if (this.props.profile.uportApps) {
      uportApps.push(claim)
      claim = {'uport-apps': uportApps}
    } else {
      claim = {'uport-apps': [claim]}
    }
    try {
      uPortConnect.sendVerification({sub: this.props.profile.did, claim: claim}, 'ADD-APP', {notifications: true})
      uPortConnect.onResponse('ADD-APP').then(payload => {
        Object.keys(uportApps).length > 0 ? this.props.saveApps(uportApps) : this.props.saveApps([claim])
        this.props.setCurrentApp({name: this.props.appDetailsappName, configuration: {network: this.props.appEnvironment.network, accentColor: this.props.appDetails.accentColor, profile: {'/': '/ipfs/' + this.props.ipfsProfileHash}}})
        // this.props.history.push('/myapps/sample-code')
      })
    } catch (e) {
      console.log(e)
    }
  }
  render () {
    return (
      <section>
        <header>
          <h2>Complete Registration</h2>
          <a href='/' className='cancel'>CANCEL</a>
        </header>
        <div className='module'>
          <h3>Check your device to register your app</h3>
          <p>You'll get a notification Lorem ipsum dolor sit amet, consectetur adipiscing</p>
        </div>
        <div className={`myapps-button`}>
          <a href='#' onClick={() => this.props.getChildState()}>
            Continue
          </a>
        </div>
      </section>
    )
  }
}

export default AppComplete

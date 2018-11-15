import React, { Component } from 'react'
import { Credentials } from 'uport-credentials'

class AppSigningKey extends Component {
  constructor (props) {
    super(props)
    const {did, privateKey} = Credentials.createIdentity()
    const credentials = new Credentials({appName: this.props.appDetails.appName, did, privateKey})
    this.state = {
      did: did,
      pk: privateKey
    }
    this.displayPK = this.displayPK.bind(this)
  }
  displayPK (e) {
    e.preventDefault()
    e.currentTarget.innerHTML = this.state.pk
  }
  render () {
    return (
      <section>
        <header>
          <h2>Download Signing Key</h2>
          <a href='/' className='cancel'>CANCEL</a>
        </header>
        <div className='module'>
          <label>Please Note</label>
          <ul>
            <li>This key is used to retain ownership of your app identity</li>
            <li>It is a private key and should be protected</li>
          </ul>
          <div className={`myapps-button`} onClick={(e) => this.displayPK(e)}>
            <a id='pk' href='#'>
              View Your Signing Key
            </a>
          </div>
        </div>
        <div className={`myapps-button`}>
          <a href='#' onClick={() => this.props.getChildState('appIdentity', {did: this.state.did})}>
            Save
          </a>
        </div>
      </section>
    )
  }
}

export default AppSigningKey

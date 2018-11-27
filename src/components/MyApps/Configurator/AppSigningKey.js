import React, { Component } from 'react'
import { Credentials } from 'uport-credentials'
import CancelModal from './CancelModal'
import arrowWhite from '../../../images/ArrowWhite.svg'
import arrowBlurple from '../../../images/ArrowBlurple.png'

class AppSigningKey extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cancelModal: false,
      did: this.props.appDetails.appIdentity.did,
      pk: this.props.appDetails.appIdentity.pk
    }
    this.displayPK = this.displayPK.bind(this)
  }
  componentDidMount() {
    this.props.onGenerateKey(this.state.pk)
  }
  displayPK (e) {
    e.preventDefault()
    e.currentTarget.innerHTML = this.state.pk
  }
  hideCancelModal = () => {
    this.setState({ cancelModal: false })
  }
  showCancelModal = () => {
    this.setState({ cancelModal: true })
  }
  render () {
    const { cancelModal } = this.state
    return (<div>
      <section className={`${cancelModal ? 'blurred' : ''}`}>
        <header>
          <h2>Download Signing Key</h2>
          <button className="btn-cancel" onClick={this.showCancelModal}>Cancel</button>
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
      </section>
      <CancelModal show={cancelModal} onClose={this.hideCancelModal} />
      <footer className='stepFooter'>
          <div className={`cta-prev`}>
            <a href='#' onClick={(e) => this.props.previousStep(e)}>
              <img src={arrowBlurple} />
              APP DETAILS
              <p>{this.props.appDetails.appName}</p>
            </a>
          </div>
          <a className={`cta-next`} href='#' onClick={() => this.props.getChildState('appIdentity', {did: this.state.did})}>
            COMPLETE REGISTRATION
            <img src={arrowWhite} />
          </a>
        </footer>
    </div>)
  }
}

export default AppSigningKey

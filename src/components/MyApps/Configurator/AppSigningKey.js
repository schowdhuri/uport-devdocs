import React, { Component } from 'react'
import { Credentials } from 'uport-credentials'
import CancelModal from './CancelModal'
import arrowWhite from '../../../images/ArrowWhite.svg'
import arrowBlurple from '../../../images/ArrowBlurple.png'
import { Container, Grid, Col } from '../../../layouts/grid'

class AppSigningKey extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cancelModal: false,
      did: this.props.appDetails.appIdentity.did,
      pk: this.props.appDetails.appIdentity.pk,
      pkVisible: false,
      pkConfirmed: false,
      pkConfirm: []
    }
    this.displayPK = this.displayPK.bind(this)
    this.handlePKConfirm = this.handlePKConfirm.bind(this)
  }
  componentDidMount() {
    this.props.onGenerateKey(this.state.pk)
  }
  displayPK (e) {
    e.preventDefault()
    this.setState({pkVisible: true})
    e.currentTarget.innerHTML = this.state.pk
  }
  handlePKConfirm(e) {
    this.setState({pkConfirmed: false})
    let index = e.target.id.slice(-1);
    let pkConfirmCopy = this.state.pkConfirm
    pkConfirmCopy[index] = e.target.value
    this.setState({pkConfirm: pkConfirmCopy})
    if (this.state.pk.slice(-4) === this.state.pkConfirm.join("")) {
      this.setState({pkConfirmed: true})
    }
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
        <Container>
          <header>
            <Grid>
              <Col span={8}>
                <h2>Download Signing Key</h2>
              </Col>
              <Col span={4}>
                <button className="btn-cancel" onClick={this.showCancelModal}>Cancel</button>
              </Col>
            </Grid>
          </header>
        <div className='module'>
          <label>Please Note</label>
          <ul>
            <li>This key is used to retain ownership of your app identity</li>
            <li>It is a private key and should be protected</li>
          </ul>
          <div className={"myapps-button signing " + (this.state.pkVisible ? '' : 'hidden')} onClick={(e) => this.displayPK(e)}>
            <a id='pk' href='#'>
              View Your Signing Key
            </a>
          </div>
          <div className={"pk-confirmation " + (this.state.pkVisible ? '' : 'hidden')}>
            <p>To confirm that you have recieved the signing key, enter the last four characters of your signing key below.</p>
            <span>LAST FOUR CHARACTERS OF YOUR SIGNING KEY</span>
            <fieldset>
              <input type='text' id='pkConfirm0' value={this.state.pkConfirm[0]} maxLength={1} onChange={(e) => { this.handlePKConfirm(e) }} />
              <input type='text' id='pkConfirm1' value={this.state.pkConfirm[1]} maxLength={1} onChange={(e) => { this.handlePKConfirm(e) }} />
              <input type='text' id='pkConfirm2' value={this.state.pkConfirm[2]} maxLength={1} onChange={(e) => { this.handlePKConfirm(e) }} />
              <input type='text' id='pkConfirm3' value={this.state.pkConfirm[3]} maxLength={1} onChange={(e) => { this.handlePKConfirm(e) }} />
            </fieldset>
          </div>
        </div>
        </Container>
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
          <a className={"cta-next " + (this.state.pkConfirmed ? '' : 'disabled')} href='#' onClick={() => this.props.getChildState('appIdentity', {did: this.state.did})}>
            COMPLETE REGISTRATION
            <img src={arrowWhite} />
          </a>
        </footer>
    </div>)
  }
}

export default AppSigningKey

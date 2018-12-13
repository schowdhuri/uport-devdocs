import React, { Component } from 'react'
import { Credentials } from 'uport-credentials'
import CancelModal from './CancelModal'
import Footer from './Footer'
import arrowWhite from '../../../images/ArrowWhite.svg'
import arrowBlurple from '../../../images/ArrowBlurple.png'
import { Container, Grid, Col, Spacer } from '../../../layouts/grid'
import UnorderedList from '../../../components/Layout/html/UnorderedList'
import { default as track, trackPage } from '../../../utilities/track'
import download from '../../../utilities/download'

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
    this.pkConfirmFields = []
    this.handlePKConfirm = this.handlePKConfirm.bind(this)
  }
  componentDidMount() {
    trackPage('App Configurator', {
      step: 'App Signing Key',
      value: {
        name: this.props.appDetails.appName,
        appURL: this.props.appDetails.appURL
      }
    })
    this.props.onGenerateKey(this.state.pk)
  }
  downloadPK = () => {
    this.track('App Configurator PK Downloaded', {
      step: 'App Signing Key'
    })
    download(`${this.props.appDetails.appName}-private-key.txt`, this.state.pk)
  }
  handlePKConfirm(e) {
    this.setState({ pkConfirmed: false })
    let index = e.target.id.slice(-1);
    let pkConfirmCopy = this.state.pkConfirm
    pkConfirmCopy[index] = e.target.value
    this.setState({ pkConfirm: pkConfirmCopy })
    if (this.state.pk.slice(-4) === this.state.pkConfirm.join("")) {
      this.setState({pkConfirmed: true})
    }
    index = parseInt(index, 10)
    if(e.target.value !== '' && index < this.pkConfirmFields.length - 1) {
      this.pkConfirmFields[index + 1].focus()
    }
  }
  handleSubmit = () => {
    this.track('App Configurator Submit Clicked', {
      step: 'App Signing Key',
      value: {
        name: this.props.appDetails.appName,
        appURL: this.props.appDetails.appURL
      }
    })
    this.props.getChildState('appIdentity', {
      did: this.state.did
    })
  }
  hideCancelModal = () => {
    this.track('App Configurator Cancel Aborted', {
      step: 'App Signing Key',
      value: {
        name: this.props.appDetails.appName,
        appURL: this.props.appDetails.appURL
      }
    })
    this.setState({ cancelModal: false })
  }
  showCancelModal = () => {
    this.track('App Configurator Cancel Clicked', {
      step: 'App Signing Key',
      value: {
        name: this.props.appDetails.appName,
        appURL: this.props.appDetails.appURL
      }
    })
    this.setState({ cancelModal: true })
  }
  track = (name, properties={}) => {
    track(name, {
      source: 'App Configurator',
      ...properties
    })
  }
  render () {
    const { cancelModal } = this.state
    return (<div>
      <section className={`${cancelModal ? 'blurred' : ''}`}>
        <Container>
          <Grid>
            <Spacer span={1} />
            <Col span={10}>
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
                <Grid>
                  <Spacer span={1} />
                  <Col span={10}>
                    <label>Please Note</label>
                    <UnorderedList>
                      <li>This key is used to retain ownership of your app identity</li>
                      <li>It is a private key and should be protected</li>
                    </UnorderedList>
                    <button className='myapps-button signing' onClick={this.downloadPK}>
                        Download Your Signing Key
                    </button>
                    <div className='pk-confirmation'>
                      <p>To confirm that you have recieved the signing key, enter the last four characters of your signing key below.</p>
                      <span>LAST FOUR CHARACTERS OF YOUR SIGNING KEY</span>
                      <fieldset>
                        <input type='text'
                          id='pkConfirm0'
                          value={this.state.pkConfirm[0]}
                          maxLength={1}
                          ref={r => this.pkConfirmFields[0] = r}
                          onChange={this.handlePKConfirm} />
                        <input type='text'
                          id='pkConfirm1'
                          value={this.state.pkConfirm[1]}
                          maxLength={1}
                          ref={r => this.pkConfirmFields[1] = r}
                          onChange={this.handlePKConfirm} />
                        <input type='text'
                          id='pkConfirm2'
                          value={this.state.pkConfirm[2]}
                          maxLength={1}
                          ref={r => this.pkConfirmFields[2] = r}
                          onChange={this.handlePKConfirm} />
                        <input type='text'
                          id='pkConfirm3'
                          value={this.state.pkConfirm[3]}
                          maxLength={1}
                          ref={r => this.pkConfirmFields[3] = r}
                          onChange={this.handlePKConfirm} />
                      </fieldset>
                    </div>
                  </Col>
                  <Spacer span={1} />
                </Grid>
              </div>
            </Col>
            <Spacer span={1} />
          </Grid>
        </Container>
      </section>
      <CancelModal show={cancelModal} onClose={this.hideCancelModal} />
      <Footer
        Prev={() => (<div>
          APP DETAILS
          <p>
            <span>{this.props.appDetails.appName}</span>
          </p>
        </div>)}
        Next={() => <span>COMPLETE REGISTRATION</span>}
        nextEnabled={this.state.pkConfirmed}
        onNext={this.handleSubmit}
        onPrev={this.props.previousStep} />
    </div>)
  }
}

export default AppSigningKey

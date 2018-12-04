import React, { Component } from 'react'
import styled from 'styled-components'
import CancelModal from './CancelModal'
import Footer from './Footer'
import arrowBlurple from '../../../images/ArrowBlurple.png'
import arrowWhite from '../../../images/ArrowWhite.svg'
import { Container, Grid, Col } from '../../../layouts/grid'
import { uPortConnect } from '../../../utilities/uPortConnectSetup'
import { default as track, trackPage } from '../../../utilities/track'

class AppRegister extends Component {
  constructor() {
    super()
    this.state = {
      cancelModal: false,
      done: false
    }
  }
  componentDidMount () {
    trackPage('App Configurator', {
      step: 'Register App'
    })
    this.showPopup();
  }
  hideCancelModal = () => {
    this.track('App Configurator Cancel Aborted', {
      step: 'Register App',
      value: {
        name: this.props.appDetails.appName,
        appUrl: this.props.appDetails.appUrl
      }
    })
    this.setState({ cancelModal: false })
  }
  showCancelModal = () => {
    this.track('App Configurator Cancel Clicked', {
      step: 'Register App',
      value: {
        name: this.props.appDetails.appName,
        appUrl: this.props.appDetails.appUrl
      }
    })
    this.setState({ cancelModal: true })
  }
  showPopup = () => {
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
      uPortConnect.sendVerification({
        sub: this.props.profile.did,
        claim
      }, 'ADD-APP', {
        notifications: true
      })
      uPortConnect.onResponse('ADD-APP').then(payload => {
        Object.keys(uportApps).length > 0 ? this.props.saveApps(uportApps) : this.props.saveApps([claim])
        this.track('App Configurator Registration Complete', {
          step: 'Register App',
          value: {
            name: this.props.appDetails.appName,
            appUrl: this.props.appDetails.appUrl
          }
        })
        this.props.setCurrentApp({
          name: this.props.appDetails.appName,
          configuration: {
            network: this.props.appEnvironment.network,
            accentColor: this.props.appDetails.accentColor,
            profile: {
              '/': '/ipfs/' + this.props.ipfsProfileHash
            }
          }
        })
        this.setState({ done: true })
      })
    } catch (e) {
      console.log(e)
      this.track('App Configurator Registration Failed', {
        step: 'Register App',
        error: e,
        value: {
          name: this.props.appDetails.appName,
          appUrl: this.props.appDetails.appUrl
        }
      })
    }
  }
  handleNext = () => {
    if(this.state.done) {
      this.track('App Configurator Submit Clicked', {
        step: 'Register App',
        value: {
          name: this.props.appDetails.appName,
          network: this.props.appEnvironment.network
        }
      })
      this.props.nextStep()
    }
  }
  track = (name, properties={}) => {
    track(name, {
      source: 'App Configurator',
      ...properties
    })
  }
  render () {
    const { cancelModal, done } = this.state
    return (<div>
      <section className={`${cancelModal ? 'blurred' : ''}`}>
        <Container>
          <header>
            <Grid>
              <Col span={8}>
                <h2>Complete Registration</h2>
              </Col>
              <Col span={4}>
                <button className="btn-cancel" onClick={this.showCancelModal}>Cancel</button>
              </Col>
            </Grid>
          </header>
          <div className='module'>
            <Heading>Check your device to register your app</Heading>
            <RetryButton onClick={this.showPopup}>
              {done ? 'Register Again' : 'Try Again'}
            </RetryButton>
          </div>
        </Container>
      </section>
      <CancelModal show={cancelModal} onClose={this.hideCancelModal} />
      <Footer
        Prev={() => (<div>
          APP DETAILS
          <p>
            <span>jhjhj{this.props.appDetails.appName}</span>
          </p>
        </div>)}
        Next={() => <span>FINISH</span>}
        nextEnabled={true}
        onNext={this.handleNext}
        onPrev={this.props.previousStep} />
    </div>)
  }
}

const Heading = styled.h3`
  text-align: center;
`
const RetryButton = styled.button`
  background: none;
  border: solid 2px #5c50ca;
  border-radius: 4px;
  color: #5c50ca;
  display: block;
  font-weight: 700;
  margin: 0 auto;
  padding: 20px 40px;
`

export default AppRegister

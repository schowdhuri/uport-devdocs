import React, { Component } from 'react'
import styled from 'styled-components'
import CancelModal from './CancelModal'
import { uPortConnect } from '../../../utilities/uPortConnectSetup'
import arrowBlurple from '../../../images/ArrowBlurple.png'
import arrowWhite from '../../../images/ArrowWhite.svg'
import { Container, Grid, Col } from '../../../layouts/grid'

class AppRegister extends Component {
  constructor() {
    super()
    this.state = {
      cancelModal: false,
      done: false
    }
  }
  componentDidMount () {
    this.showPopup();
  }
  hideCancelModal = () => {
    this.setState({ cancelModal: false })
  }
  showCancelModal = () => {
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
        this.props.setCurrentApp({
          name: this.props.appDetailsappName,
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
    }
  }
  handleNext = () => {
    if(this.state.done)
      this.props.nextStep()
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
      <footer className='stepFooter'>
        <div className={`cta-prev`}>
          <a href='#' onClick={this.props.previousStep}>
            <img src={arrowBlurple} />
            APP DETAILS
            <p>{this.props.appDetails.appName}</p>
          </a>
        </div>
        <a className={"cta-next " + (done ? '' : 'disabled')} href='#' onClick={this.handleNext}>
          FINISH
          <img src={arrowWhite} />
        </a>
      </footer>
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

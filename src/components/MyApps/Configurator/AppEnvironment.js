import React, { Component } from 'react'
import Select from 'react-select'
import styled from 'styled-components'
import CancelModal from './CancelModal'
import Footer from './Footer'
import RadioButton from './RadioButton'
import { Container, Grid, Col, Spacer } from '../../../layouts/grid'
import { default as track, trackPage } from '../../../utilities/track'

const networkOptions = [
  { value: 'mainnet', label: 'Mainnet' },
  { value: 'rinkeby', label: 'Rinkeby' },
  { value: 'kovan', label: 'Kovan' },
  { value: 'ropsten', label: 'Ropsten' },
  { value: 'none', label: 'No Network' }
]

class AppEnvironment extends Component {
  constructor (props) {
    super(props)
    this.state = {
      cancelModal: false,
      network: props.appEnvironment.network,
      environment: props.appEnvironment.environment,
      selectedNetworkObj: networkOptions
        .find(n => n.value == props.appEnvironment.network) || networkOptions[0]
    }
    this.handleNetworkChange = this.handleNetworkChange.bind(this)
    this.handleEnvironmentChange = this.handleEnvironmentChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentDidMount() {
    trackPage('App Configurator', {
      step: 'App Environment'
    })
  }
  hideCancelModal = () => {
    this.track('App Configurator Cancel Aborted', {
      step: 'App Environment'
    })
    this.setState({ cancelModal: false })
  }
  handleEnvironmentChange (environment) {
    this.setState({ environment })
  }
  handleNetworkChange (selectedOption) {
    this.setState({
      network: selectedOption.value,
      selectedNetworkObj: selectedOption
    })
  }
  handleSubmit (e) {
    const { environment, network } = this.state
    if (environment) {
      this.track('App Configurator Submit Clicked', {
        step: 'App Environment',
        value: {
          environment,
          network
        }
      })
      this.props.getChildState('appEnvironment', {
        network: network,
        environment: environment
      })
    } else {
      this.track('App Configurator Submit Clicked', {
        step: 'App Environment',
        notes: [
          'Required field missing: environment'
        ]
      })
    }
  }
  showCancelModal = () => {
    this.track('App Configurator Cancel Clicked', {
      step: 'App Environment'
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
    const { cancelModal, environment } = this.state
    return (<Wrapper>
      <section className={`${cancelModal ? 'blurred' : ''}`}>
        <Container>
          <Grid>
            <Spacer span={1} />
            <Col span={10}>
              <header>
                <Grid>
                  <Col span={8}>
                    <h2>Select App Environment</h2>
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
                    <label htmlFor='environment'>Environment</label>
                  </Col>
                  <Spacer span={1} />
                  <Spacer span={1} />
                  <Col span={5}>
                    <Option
                      className={`radioContainer ${environment=='client' ? 'active' : ''}`}
                      onClick={() => this.handleEnvironmentChange('client')}
                    >
                      <RadioButton
                        value='client'
                        name='environment'
                        label='Client side'
                        checked={environment === 'client'}
                        onChange={this.handleEnvironmentChange} />
                      <span className='note'>
                        Allows you to interact with a user's uPort identity through the mobile app - create requests for a user's data, share credentials, and generate transactions to be signed on the user's mobile app.
                      </span>
                    </Option>
                  </Col>
                  <Col span={5}>
                    <Option
                      className={`radioContainer ${environment=='server' ? 'active' : ''}`}
                      onClick={() => this.handleEnvironmentChange('server')}
                    >
                      <RadioButton
                        value='server'
                        name='environment'
                        label='Server side'
                        checked={environment === 'server'}
                        onChange={this.handleEnvironmentChange} />
                      <span className='note'>
                        Provides a generated signing key to be stored securely on your server. Using a consistent signing key allows you to better establish trust with your users when issuing credentials or signing transactions.
                      </span>
                    </Option>
                  </Col>
                  <Spacer span={1} />
                  <Spacer span={1} />
                  <Col span={10}>
                    <div className='select-network'>
                      <label htmlFor='network'>Select a network</label>
                      <Select
                        className='networkDropdown'
                        classNamePrefix='networkDropdown'
                        value={this.state.selectedNetworkObj}
                        onChange={this.handleNetworkChange}
                        options={networkOptions}
                        isSearchable={false}
                        blurInputOnSelect
                      />
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
        Next={() => <span>ADD APP DETAILS</span>}
        nextEnabled={this.state.environment}
        onNext={this.handleSubmit} />
    </Wrapper>)
  }
}

const Wrapper = styled.div`
  section {
    padding-bottom: 80px;
  }
`
const Option = styled.div``

export default AppEnvironment

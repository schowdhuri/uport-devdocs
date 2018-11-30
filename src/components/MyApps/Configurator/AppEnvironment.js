import React, { Component } from 'react'
import Select from 'react-select'
import styled from 'styled-components'
import CancelModal from './CancelModal'
import Footer from './Footer'
import RadioButton from './RadioButton'
import { Container, Grid, Col } from '../../../layouts/grid'
import { default as track, trackPage } from '../../../utilities/track'

const networkOptions = [
  { value: 'mainnet', label: 'Mainnet' },
  { value: 'rinkeby', label: 'Rinkeby' },
  { value: 'kovan', label: 'Kovan' },
  { value: 'ropsten', label: 'Ropsten' }
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
  track = (name, properties={}) => () => {
    track(name, {
      source: 'App Configurator',
      ...properties
    })
  }
  render () {
    const { cancelModal, environment } = this.state
    return (<div>
      <section className={`${cancelModal ? 'blurred' : ''}`}>
        <Container>
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
              <Col span={12}>
                <label htmlFor='environment'>Environment</label>
              </Col>
              <Col span={6}>
                <Option
                  active={environment=='client'}
                  className='radioContainer'
                  onClick={() => this.handleEnvironmentChange('client')}
                >
                  <RadioButton
                    value='client'
                    name='environment'
                    label='Client side'
                    checked={environment === 'client'}
                    onChange={this.handleEnvironmentChange} />
                  <span className='note'>
                    Login flow, credential consumption and ability
                    to customize requests with your own branding. 
                  </span>
                </Option>
              </Col>
              <Col span={6}>
                <Option
                  active={environment=='server'}
                  className='radioContainer'
                  onClick={() => this.handleEnvironmentChange('server')}
                >
                  <RadioButton
                    value='server'
                    name='environment'
                    label='Server side'
                    checked={environment === 'server'}
                    onChange={this.handleEnvironmentChange} />
                  <span className='note'>
                    Login flow, credential issuance and ability
                    to customize requests with your own branding.
                  </span>
                </Option>
              </Col>
              <Col span={12}>
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
            </Grid>
          </div>
        </Container>
      </section>
      <CancelModal show={cancelModal} onClose={this.hideCancelModal} />
      <Footer
        Next={() => <span>ADD APP DETAILS</span>}
        nextEnabled={this.state.environment}
        onNext={this.handleSubmit} />
    </div>)
  }
}

const Option = styled.div`
  ${props => props.active ? 'border: solid 2px #827cff;' : ''}
  &:hover {
    border: solid 2px #827cff;
  }
`

export default AppEnvironment

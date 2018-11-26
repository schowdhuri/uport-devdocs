import React, { Component } from 'react'
import Select from 'react-select'
import CancelModal from './CancelModal'
import RadioButton from './RadioButton'
import styled from 'styled-components'
import arrowWhite from '../../../images/ArrowWhite.svg'

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
      network: this.props.appEnvironment.network,
      environment: this.props.appEnvironment.environment,
      selectedNetworkObj: networkOptions[0]
    }
    this.handleNetworkChange = this.handleNetworkChange.bind(this)
    this.handleEnvironmentChange = this.handleEnvironmentChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleNetworkChange (selectedOption) {
    this.setState({ network: selectedOption.value, selectedNetworkObj: selectedOption })
  }
  handleEnvironmentChange (environment) {
    this.setState({ environment })
  }
  hideCancelModal = () => {
    this.setState({ cancelModal: false })
  }
  showCancelModal = () => {
    this.setState({ cancelModal: true })
  }
  handleSubmit (e) {
    if (this.state.environment) {
      this.props.getChildState('appEnvironment', {network: this.state.network, environment: this.state.environment})
    }
  }
  render () {
    const { cancelModal, environment } = this.state
    return (<div>
      <section className={`${cancelModal ? 'blurred' : ''}`}>
        <header>
          <h2>Select App Environment</h2>
          <button className="btn-cancel" onClick={this.showCancelModal}>Cancel</button>
        </header>
        <Grid className='module'>
          <label className='env-label' htmlFor='environment'>Environment</label>
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
            <span className='note'><strong>Type: </strong>Simple Ethereum keypair</span>
            <span className='note'><strong>Funding: </strong>Gas is self-funded</span>
            <span className='note'><strong>Network: </strong>Supported on mainnet and testnets</span>
          </Option>
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
            <span className='note'><strong>Type: </strong>Simple Ethereum keypair</span>
            <span className='note'><strong>Funding: </strong>Gas is self-funded</span>
            <span className='note'><strong>Network: </strong>Supported on mainnet and testnets</span>
          </Option>
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
        </Grid>
      </section>
      <CancelModal show={cancelModal} onClose={this.hideCancelModal} />
      <footer className='stepFooter'>
        <a className={"cta-next " + (this.state.environment ? '' : 'disabled')} href='#' onClick={(e) => this.handleSubmit(e)}>
          ADD APP DETAILS
          <img src={arrowWhite} />
        </a>
      </footer>
    </div>)
  }
}

const Option = styled.div`
  ${props => props.active ? 'border: solid 2px #827cff;' : ''}
  &:hover {
    border: solid 2px #827cff;
  }
`

const Grid = styled.div`
  .env-label {
    padding: 0;
    margin: 0;
  }
  @media screen and (min-width: 768px) {
    display: grid;
    grid-gap: 0 20px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    width: 100%;

    .env-label {
      grid-area: 1 / 1 / 2 / 3;
    }
    .select-network {
      grid-area: 3 / 1 / 4 / 3;
    }
  }
`

export default AppEnvironment

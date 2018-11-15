import React, { Component } from 'react'
import Select from 'react-select'

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
      network: null,
      environment: null,
      selectedNetworkObj: networkOptions[0]
    }
    this.handleNetworkChange = this.handleNetworkChange.bind(this)
    this.handleEnvironmentChange = this.handleEnvironmentChange.bind(this)
  }
  handleNetworkChange (selectedOption) {
    this.setState({ network: selectedOption.value, selectedNetworkObj: selectedOption })
  }
  handleEnvironmentChange (e) {
    this.setState({environment: e.target.value})
  }
  render () {
    return (
      <section>
        <header>
          <h2>Select App Environment</h2>
          <a href='/' className='cancel'>CANCEL</a>
        </header>
        <div className='module'>
          <label htmlFor='environment'>Environment</label>
          <div className='radioContainer'>
            <label>
              <input type='radio' id='client' value='client' name='environment' checked={this.state.environment === 'client'} onChange={(e) => { this.handleEnvironmentChange(e) }} />
              <p>Client Side</p>
              <span className='checkmark' />
            </label>
            <span className='note'><strong>Type: </strong>Simple Ethereum keypair</span>
            <span className='note'><strong>Funding: </strong>Gas is self-funded</span>
            <span className='note'><strong>Network: </strong>Supported on mainnet and testnets</span>
          </div>
          <div className='radioContainer'>
            <label>
              <input type='radio' id='server' value='server' name='environment' checked={this.state.environment === 'server'} onChange={(e) => { this.handleEnvironmentChange(e) }} />
              <p>Server Side</p>
              <span className='checkmark' />
            </label>
            <span className='note'><strong>Type: </strong>Simple Ethereum keypair</span>
            <span className='note'><strong>Funding: </strong>Gas is self-funded</span>
            <span className='note'><strong>Network: </strong>Supported on mainnet and testnets</span>
          </div>
          <label htmlFor='network'>Select a network</label>
          <Select
            className='networkDropdown'
            classNamePrefix='networkDropdown'
            value={this.props.network}
            onChange={this.handleNetworkChange}
            options={networkOptions}
            isSearchable={false}
            blurInputOnSelect
          />
        </div>
        <div className={`myapps-button`}>
          <a href='#' onClick={() => this.props.getChildState('appEnvironment', {network: this.state.network, environment: this.state.environment})}>
            Save
          </a>
        </div>
      </section>
    )
  }
}

export default AppEnvironment

import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ipfsAPI from 'ipfs-api'
import Select from 'react-select'
import SiteHeader from '../../components/Layout/Header'
import config from '../../../data/SiteConfig'
import errorIcon from '../../images/error-icon.svg'
import '../../layouts/css/myapps.css'
import { Connect } from 'uport-connect'

const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

const BodyContainer = styled.div`
background-color: #f9f9fa;
height: 100%;
`

const networkOptions = [
  { value: 'mainnet', label: 'Mainnet' },
  { value: 'rinkeby', label: 'Rinkeby' },
  { value: 'kovan', label: 'Kovan' },
  { value: 'ropsten', label: 'Ropsten' }
]

class MyAppsStartBuildingPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      appName: this.props.currentApp.name || '',
      network: this.props.currentApp.configuration.network || 'mainnet',
      accountType: this.props.currentApp.configuration.accountType || 'keypair',
      selectedNetworkObj: networkOptions.filter(obj => { return obj.value === this.props.currentApp.configuration.network }) || networkOptions[0],
      appNameValid: false,
      data_uri: null,
      file_name: null,
      file_type: null,
      formSubmitted: false
    }
    this.handleAppNameChange = this.handleAppNameChange.bind(this)
    this.handleNetworkChange = this.handleNetworkChange.bind(this)
    this.handleAccountTypeChange = this.handleAccountTypeChange.bind(this)
    this.handleAppImageChange = this.handleAppImageChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentWillMount () {
    if (Object.keys(this.props.profile).length === 0) {
      const history = this.props.history
      history.push('/myapps/')
    }
  }
  handleAppNameChange (e) {
    this.setState({appName: e.target.value})
  }
  handleNetworkChange (selectedOption) {
    this.setState({ network: selectedOption.value, selectedNetworkObj: selectedOption })
  }
  handleAccountTypeChange (e) {
    e.target.value === 'none'
      ? this.setState({accountType: e.target.value, network: ''})
      : this.setState({accountType: e.target.value})
  }
  handleAppImageChange (e) {
    const photo = e.target.files[0]
    const reader = new window.FileReader()
    reader.onloadend = function () {
      const buf = new Buffer(reader.result)
      ipfs.files.add(buf, (err, result) => {
        if (err) {
          console.error(err)
          return
        }
        let url = `https://ipfs.io/ipfs/${result[0].hash}`
        console.log(url)
      })
    }
    reader.readAsArrayBuffer(photo)
  }
  handleSubmit (e) {
    e.preventDefault()
    this.setState({formSubmitted: true})
    this.state.appName === ''
    ? this.setState({appNameValid: false})
    : this.setState({appNameValid: true}, () => {
      if (this.state.appNameValid) {
      // Check for existing apps
        let claim = {}
        if (this.props.profile.uportApps) {
          let uportApps = this.props.profile.uportApps
          uportApps.push({name: this.state.appName,
            configuration: {
              network: this.state.network,
              accountType: this.state.accountType
            }
          })
          claim = {'uport-apps': uportApps}
        } else {
          claim = {'uport-apps': [{
            name: this.state.appName,
            configuration: {
              network: this.state.network,
              accountType: this.state.accountType
            }
          }]}
        }
        try {
          // TODO put this in a global
          const uPortConnect = new Connect('MyApps')
          // debugger
          uPortConnect.sendVerification({sub: this.props.profile.did, claim: claim}, 'ADD-APP')
          uPortConnect.onResponse('ADD-APP').then(payload => {
            this.props.history.push('/myapps/sample-code')
          })
        } catch (e) {
          console.log(e)
        }
        this.props.setCurrentApp({name: this.state.appName, configuration: {network: this.state.network, accountType: this.state.accountType}})
      }
    })
  }
  render () {
    let selectedNetwork = this.state.selectedNetworkObj
    return (
      <div className='index-container appmgr'>
        <Helmet title={config.siteTitle} />
        <main>
          <MyAppsHeadContainer>
            <SiteHeader
              activeCategory={''}
              location={this.props.location}
              categories={this.props.data.navCategories} />
          </MyAppsHeadContainer>
          <BodyContainer className='appMgrBody startBuilding'>
            <form onSubmit={(e) => { this.handleSubmit(e) }}>
              <div className={'Grid Grid--gutters'}>
                <div className='Grid-cell sidebar'>
                  <h4>Register an app</h4>
                  <ul>
                    <li className='active'><a href='#'>App Details</a></li>
                    <li><a>Sample Code</a></li>
                  </ul>
                </div>
                <div className='Grid-cell'>
                  <h1>App Details</h1>
                  <label htmlFor='appName'>App Name</label>
                  <div className={(!this.state.appNameValid && this.state.formSubmitted) ? 'fieldError' : ''}>
                    <input type='text' id='appName' placeholder='Give your app a name' value={this.state.appName} onChange={(e) => { this.handleAppNameChange(e) }} />
                    {(!this.state.appNameValid && this.state.formSubmitted) && 
                      <span className='error'>
                        <img src={errorIcon} />
                        AppName is required
                      </span>
                    }
                  </div>
                  <label htmlFor='appName'>Select an account type</label>
                  <span className='note'><strong>Note: </strong>This option can be changed in the future</span>
                  <div className='radioContainer'>
                    <label>
                      <input type='radio' id='keypair' value='keypair' name='accountType' checked={this.state.accountType === 'keypair'} onChange={(e) => { this.handleAccountTypeChange(e) }} />
                      <p>Keypair Account</p>
                      <span className='checkmark' />
                    </label>
                    <span className='note'><strong>Type: </strong>Simple Ethereum keypair</span>
                    <span className='note'><strong>Funding: </strong>Gas is self-funded</span>
                    <span className='note'><strong>Network: </strong>Supported on mainnet and testnets</span>
                  </div>
                  <div className='radioContainer'>
                    <label>
                      <input type='radio' id='none' value='none' name='accountType' checked={this.state.accountType === 'none'} onChange={(e) => { this.handleAccountTypeChange(e) }} />
                      <p>None</p>
                      <span className='checkmark' />
                    </label>
                    <span className='note'><strong>Type: </strong>No Ethereum account</span>
                    <span className='note'><strong>Funding: </strong>N/A</span>
                    <span className='note'><strong>Network: </strong>N/A</span>
                  </div>
                  <label htmlFor='network'>Select a network</label>
                  <Select
                    className='networkDropdown'
                    classNamePrefix='networkDropdown'
                    value={selectedNetwork}
                    onChange={this.handleNetworkChange}
                    options={networkOptions}
                    isSearchable={false}
                    blurInputOnSelect
                    isDisabled={this.state.accountType === 'none'}
                  />
                  <div className='appBranding Grid'>
                    <div className='Grid-cell brandingSettings'>
                      <h4>App Branding</h4>
                      <div className='colorPicker'>
                        <label htmlFor='accentColor'>App Accent Color</label>
                        <input type='text' id='accentColor' placeholder='#5C50CA' value='#5C50CA' />
                        <div className='colorPreview' />
                      </div>
                      <div className='appImage'>
                        <label htmlFor='appImage'>App Profile Image</label>
                        <div className='fileUpload'>
                          <span>Upload Image</span>
                          <input type='file' className='upload' onChange={(e) => { this.handleAppImageChange(e) }} />
                        </div>
                        <div className='imagePreview' />
                      </div>
                    </div>
                    <div className='Grid-cell brandingPreview'>
                      <div className='appItem'>
                        <div className='appCover'>&nbsp;</div>
                        <div className='avatar'>
                          &nbsp;
                        </div>
                        <h3>{this.state.appName || 'App Name'}</h3>
                        <span>{this.state.network}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <footer>
                <a href='/'>Having trouble getting your app set up? Get in touch with us.</a>
                <button type='submit' className='continue'>Continue</button>
              </footer>
            </form>
          </BodyContainer>
        </main>
      </div>
    )
  }
}

const MyAppsHeadContainer = styled.div`
  background: ${props => props.theme.brand}
`

export const pageQuery = graphql`
query AppManagerStartBuildingQuery {
    allMarkdownRemark(
      limit: 2000
      filter: { frontmatter: { type: { eq: "content" }}}
    ) {
      edges {
        node {
          fields {
            slug
          }
          excerpt
          timeToRead
          frontmatter {
            title
          }
        }
      }
    }
    navCategories:
    allMarkdownRemark(
      filter: { frontmatter: { category: { ne: null }, index: { ne: null }}}
    ) {
      edges {
        node {
          fields {
            slug
          }
          headings {
            value
            depth
          }
          frontmatter {
            category
            index
          }
        }
      }
    }
  }
`

MyAppsStartBuildingPage.propTypes = {
  profile: PropTypes.object.isRequired,
  setCurrentApp: PropTypes.func.isRequired
}

const mapStateToProps = ({ profile, currentApp }) => {
  return { profile, currentApp }
}

function base64ArrayBuffer (arrayBuffer) {
  let base64 = ''
  const encodings = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

  const bytes = new Uint8Array(arrayBuffer)
  const byteLength = bytes.byteLength
  const byteRemainder = byteLength % 3
  const mainLength = byteLength - byteRemainder

  let a
  let b
  let c
  let d
  let chunk

  // Main loop deals with bytes in chunks of 3
  for (let i = 0; i < mainLength; i += 3) {
    // Combine the three bytes into a single integer
    chunk = (bytes[i] << 16) | (bytes[i + 1] << 8) | bytes[i + 2]

    // Use bitmasks to extract 6-bit segments from the triplet
    a = (chunk & 16515072) >> 18 // 16515072 = (2^6 - 1) << 18
    b = (chunk & 258048) >> 12 // 258048   = (2^6 - 1) << 12
    c = (chunk & 4032) >> 6 // 4032     = (2^6 - 1) << 6
    d = chunk & 63 // 63       = 2^6 - 1

    // Convert the raw binary segments to the appropriate ASCII encoding
    base64 += encodings[a] + encodings[b] + encodings[c] + encodings[d]
  }

  // Deal with the remaining bytes and padding
  if (byteRemainder === 1) {
    chunk = bytes[mainLength]

    a = (chunk & 252) >> 2 // 252 = (2^6 - 1) << 2

    // Set the 4 least significant bits to zero
    b = (chunk & 3) << 4 // 3   = 2^2 - 1

    base64 += `${encodings[a]}${encodings[b]}==`
  } else if (byteRemainder === 2) {
    chunk = (bytes[mainLength] << 8) | bytes[mainLength + 1]

    a = (chunk & 64512) >> 10 // 64512 = (2^6 - 1) << 10
    b = (chunk & 1008) >> 4 // 1008  = (2^6 - 1) << 4

    // Set the 2 least significant bits to zero
    c = (chunk & 15) << 2 // 15    = 2^4 - 1

    base64 += `${encodings[a]}${encodings[b]}${encodings[c]}=`
  }

  return base64
}

const mapDispatchToProps = dispatch => {
  return { setCurrentApp: (app) => dispatch({ type: `SET_CURRENT_APP`, app: app }) }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAppsStartBuildingPage)

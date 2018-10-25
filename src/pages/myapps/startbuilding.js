import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from 'react-select'
import SiteHeader from '../../components/Layout/Header'
import config from '../../../data/SiteConfig'
import errorIcon from '../../images/error-icon.svg'
import myAppsBg from '../../images/myapps-bg.svg'
import '../../layouts/css/myapps.css'
import { uPortConnect } from '../../utilities/uPortConnectSetup'
import { addFile } from '../../utilities/ipfs'

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
      appName: '',
      network: 'mainnet',
      accountType: 'keypair',
      selectedNetworkObj: networkOptions[0],
      file_name: null,
      file_type: null,
      ipfsLogoHash: null,
      ipfsBgHash: null,
      ipfsProfileClaim: null,
      ipfsProfileHash: null,
      accentColor: '#5C50CA',
      appNameValid: false,
      formSubmitted: false,
      duplicateAppName: false
    }
    this.handleAppNameChange = this.handleAppNameChange.bind(this)
    this.handleNetworkChange = this.handleNetworkChange.bind(this)
    this.handleAccountTypeChange = this.handleAccountTypeChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAppImageChange = this.handleAppImageChange.bind(this)
    this.buildClaim = this.buildClaim.bind(this)
    this.uploadClaim = this.uploadClaim.bind(this)
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
  handleAccentColorChange (e) {
    this.setState({accentColor: e.target.value})
  }
  handleAppImageChange (e) {
    const photo = e.target.files[0]
    const reader = new window.FileReader()
    let that = this
    reader.onloadend = async function () {
      const buf = new Buffer(reader.result)
      const ipfsHash = await addFile(buf)
      that.setState({ipfsLogoHash: ipfsHash})
      that.setState({ipfsLogoUrl: `https://ipfs.io/ipfs/${ipfsHash}`})
      console.log(`Uploaded profileImage: https://ipfs.io/ipfs/${ipfsHash}`)
    }
    reader.readAsArrayBuffer(photo)
  }
  async buildClaim () {
    let profileClaim = {'name': this.state.appName}
    if (this.state.ipfsLogoHash !== null) profileClaim['profileImage'] = {'/': '/ipfs/' + this.state.ipfsLogoHash}
    return new Promise(async (resolve, reject) => {
      if ((this.state.accentColor !== '' || this.state.accentColor !== '#5C50CA') && this.state.ipfsBgHash === null) {
        // Generate image from accentColor and upload to IPFS
        let canvas = document.getElementById('canvas')
        let ctx = canvas.getContext('2d')
        ctx.fillStyle = this.state.accentColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        let that = this
        canvas.toBlob(function (blob) {
          var reader = new window.FileReader()
          reader.onloadend = async function () {
            const buf = new Buffer(reader.result)
            const ipfsHash = await addFile(buf)
            that.setState({ipfsBgHash: ipfsHash})
            console.log(`Uploaded bannerImage: https://ipfs.io/ipfs/${ipfsHash}`)
            profileClaim['bannerImage'] = {'/': `/ipfs/${ipfsHash}`}
            const ipfsClaimHash = await that.uploadClaim(profileClaim)
            resolve(ipfsClaimHash)
          }
          reader.readAsArrayBuffer(blob)
        })
      } else {
        const ipfsClaimHash = await this.uploadClaim(profileClaim)
        resolve(ipfsClaimHash)
      }
    })
  }
  async uploadClaim (profileClaim) {
    let dataStr = JSON.stringify(profileClaim)
    const buf = new Buffer(dataStr)
    let that = this
    return new Promise(async (resolve, reject) => {
      const ipfsHash = await addFile(buf)
      that.setState({ipfsProfileHash: ipfsHash})
      console.log(`Uploaded profile claim: https://ipfs.io/ipfs/${ipfsHash}`)
      resolve(ipfsHash)
    })
  }
  handleSubmit (e) {
    e.preventDefault()
    let uportApps = this.props.profile.uportApps || {}
    let uportAppNames = (Object.keys(uportApps).length > 0 ? uportApps.map(app => app.name) : [])
    this.setState({formSubmitted: true})
    this.state.appName === '' || uportAppNames.indexOf(this.state.appName) >= 0
    ? this.setState({appNameValid: false, duplicateAppName: (uportAppNames.indexOf(this.state.appName) >= 0)})
    : this.setState({appNameValid: true}, async () => {
      if (this.state.appNameValid) {
        await this.buildClaim()
        let claim = {
          name: this.state.appName,
          configuration: {
            network: this.state.network,
            accountType: this.state.accountType,
            accentColor: this.state.accentColor,
            profile: {'/': '/ipfs/' + this.state.ipfsProfileHash}
          }
        }
        if (this.props.profile.uportApps) {
          uportApps.push(claim)
          claim = {'uport-apps': uportApps}
        } else {
          claim = {'uport-apps': [claim]}
        }
        try {
          uPortConnect.sendVerification({sub: this.props.profile.did, claim: claim}, 'ADD-APP', {notifications: true})
          uPortConnect.onResponse('ADD-APP').then(payload => {
            Object.keys(uportApps).length > 0
            ? this.props.saveApps(uportApps)
            : this.props.saveApps([claim])
            this.props.setCurrentApp({name: this.state.appName, configuration: {network: this.state.network, accountType: this.state.accountType, accentColor: this.state.accentColor, profile: {'/': '/ipfs/' + this.state.ipfsProfileHash}}})
            this.props.history.push('/myapps/sample-code')
          })
        } catch (e) {
          console.log(e)
        }
      }
    })
  }
  render () {
    let selectedNetwork = this.state.selectedNetworkObj
    const bgImageStyle = {backgroundImage: this.state.ipfsLogoHash ? `url(https://ipfs.io/ipfs/${this.state.ipfsLogoHash})` : `url(${myAppsBg})`}
    return (
      Object.keys(this.props.profile).length
      ? <div className='index-container startBuilding'>
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
                        {this.state.duplicateAppName ? 'App name already in use' : 'App name is required'}
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
                        <input type='text' id='accentColor' placeholder='#5C50CA' value={this.state.accentColor} onChange={(e) => { this.handleAccentColorChange(e) }} />
                        <div className='colorPreview' style={{backgroundColor: this.state.accentColor}} />
                      </div>
                      <div className='appImage'>
                        <label htmlFor='appImage'>App Profile Image</label>
                        <div className='fileUpload'>
                          <span>Upload Image</span>
                          <input type='file' className='upload' onChange={(e) => { this.handleAppImageChange(e) }} />
                        </div>
                        <div className={'imagePreview ' + (this.state.ipfsLogoHash ? 'uploaded' : 'default')} style={bgImageStyle} />
                      </div>
                    </div>
                    <div className='Grid-cell brandingPreview'>
                      <div className='appItem'>
                        <div className='appCover' style={{backgroundColor: this.state.accentColor}}>&nbsp;</div>
                        <div className={'avatar ' + (this.state.ipfsLogoHash ? 'uploaded' : 'default')} style={bgImageStyle}>
                          &nbsp;
                        </div>
                        <h3>{this.state.appName || 'App Name'}</h3>
                        <span>{this.state.network}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <canvas width='100' height='100' id='canvas' style={{visibility: 'hidden'}} />
              <footer>
                <a href='https://chat.uport.me/#/home'>Having trouble getting your app set up? Get in touch with us.</a>
                <button type='submit' className='continue'>Continue</button>
              </footer>
            </form>
          </BodyContainer>
        </main>
      </div>
      : this.props.history.push('/myapps')
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
  saveApps: PropTypes.func.isRequired,
  setCurrentApp: PropTypes.func.isRequired
}

const mapStateToProps = ({ profile }) => {
  return { profile }
}

const mapDispatchToProps = dispatch => {
  return {
    saveApps: (apps) => dispatch({ type: `SAVE_APPS`, uportApps: apps }),
    setCurrentApp: (app) => dispatch({ type: `SET_CURRENT_APP`, app: app })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAppsStartBuildingPage)

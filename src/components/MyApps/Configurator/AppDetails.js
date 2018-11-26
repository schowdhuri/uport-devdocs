import React, { Component } from 'react'
import styled from 'styled-components'
import { addFile } from '../../../utilities/ipfs'
import errorIcon from '../../../images/error-icon.svg'
import myAppsBg from '../../../images/myapps-bg.svg'
import CancelModal from './CancelModal'
import arrowWhite from '../../../images/ArrowWhite.svg'
import arrowBlurple from '../../../images/ArrowBlurple.png'
import '../../../layouts/css/myapps.css'

class AppDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      appName: this.props.appDetails.appName,
      appURL: this.props.appDetails.appURL,
      appDescription: this.props.appDescription,
      cancelModal: false,
      file_name: null,
      file_type: null,
      ipfsLogoHash: null,
      ipfsBgHash: null,
      accentColor: '#5C50CA',
      appNameValid: false,
      formSubmitted: false,
      duplicateAppName: false
    }
    this.handleAppNameChange = this.handleAppNameChange.bind(this)
    this.handleAppURLChange = this.handleAppURLChange.bind(this)
    this.handleAppImageChange = this.handleAppImageChange.bind(this)
    this.handleAccentColorChange = this.handleAccentColorChange.bind(this)
    this.handleBgImageUpload = this.handleBgImageUpload.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  handleAppNameChange (e) {
    this.setState({appName: e.target.value})
    e.target.value !== '' ? this.setState({appNameValid: true}) : this.setState({appNameValid: false})
  }
  handleAppURLChange (e) {
    this.setState({appURL: e.target.value})
  }
  handleAppDescriptionChange (e) {
    this.setState({appDescription: e.target.value})
  }
  handleAppImageChange (e) {
    const photo = e.target.files[0]
    const result = addFile(photo).then(result => {
      this.setState({ipfsLogoHash: result.Hash})
      console.log(`Uploaded profileImage: https://ipfs.io/ipfs/${result.Hash}`)
    }).catch(err => {
      console.log('Upload failed')
    })
  }
  handleAccentColorChange (e) {
    this.setState({accentColor: e.target.value})
  }
  async handleBgImageUpload () {
    // Generate image from accentColor and upload to IPFS
    return new Promise(async (resolve, reject) => {
      let canvas = document.getElementById('canvas')
      let ctx = canvas.getContext('2d')
      ctx.fillStyle = this.state.accentColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      canvas.toBlob(blob => {
        addFile(blob).then(result => {
          this.setState({ipfsBgHash: result.Hash})
          console.log(`Uploaded bannerImage: https://ipfs.io/ipfs/${result.Hash}`)
          resolve(result.Hash)
        })
      })
    })
  }
  handleSubmit (e) {
    e.preventDefault()
    let uportApps = this.props.uportApps || {}
    let uportAppNames = (Object.keys(uportApps).length > 0 ? uportApps.map(app => app.name) : [])
    this.setState({formSubmitted: true})
    this.state.appName === '' || uportAppNames.indexOf(this.state.appName) >= 0
    ? this.setState({appNameValid: false, duplicateAppName: (uportAppNames.indexOf(this.state.appName) >= 0)})
    : this.setState({appNameValid: true}, async () => {
      if (this.state.appNameValid) {
        if ((this.state.accentColor !== '' || this.state.accentColor !== '#5C50CA') && this.state.ipfsBgHash === null) { await this.handleBgImageUpload() }
        this.props.getChildState('appDetails', {
          appName: this.state.appName,
          appURL: this.state.appURL,
          appDescription: this.state.appDescription,
          ipfsLogoHash: this.state.ipfsLogoHash,
          ipfsBgHash: this.state.ipfsBgHash,
          accentColor: this.state.accentColor
        })
      }
    })
  }
  hideCancelModal = () => {
    this.setState({ cancelModal: false })
  }
  showCancelModal = () => {
    this.setState({ cancelModal: true })
  }
  render () {
    const { cancelModal } = this.state;
    const bgImageStyle = {backgroundImage: this.state.ipfsLogoHash ? `url(https://ipfs.io/ipfs/${this.state.ipfsLogoHash})` : `url(${myAppsBg})`}
    return (<div>
      <section className={`startBuilding ${cancelModal ? 'blurred' : ''}`}>
        <header>
          <button className="btn-cancel" onClick={this.showCancelModal}>Cancel</button>
          <h2>Add App Details</h2>
        </header>
        <div className='module'>
          <form onSubmit={(e) => { this.handleSubmit(e) }}>
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
            <LabelRow>
              <label htmlFor='appURL'>
                URL Address {" "}
                <Subtle>(optional)</Subtle>
              </label>
              <Tooltip>
                <Tooltip.Hotspot>?</Tooltip.Hotspot>
                <Tooltip.Popover>
                  <Tooltip.Body>
                    <Tooltip.Header>Why we ask for URL address?</Tooltip.Header>
                      <p>
                        This signing (private) key should be protected.
                        Do not distribute it publicly. We display the private key
                        in our demos, guides, and tutorials for an educational
                        purpose and recommend that you use your own signing key
                        and application identifier (MNID) in place of the ones we
                        provide for reference.
                      </p>
                  </Tooltip.Body>
                </Tooltip.Popover>
              </Tooltip>
            </LabelRow>
              <input type='text' id='appURL' placeholder='https://yourapphomepage.com' value={this.state.appURL} onChange={(e) => { this.handleAppURLChange(e) }} />
            <label htmlFor='appDescription'>
              App Description {" "}
              <Subtle>(optional)</Subtle>
            </label>
            <textarea rows='4' cols='50' placeholder='Describe what your app can do...' value={this.state.appDescription} onChange={(e) => { this.handleAppDescriptionChange(e) }} />
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
                  <span>{this.props.appEnvironment.network}</span>
                </div>
              </div>
            </div>
          </form>
        </div>
        <canvas width='100' height='100' id='canvas' style={{visibility: 'hidden'}} />
        <footer className='stepFooter'>
          <div className={`cta-prev`}>
            <a href='#' onClick={(e) => this.props.previousStep(e)}>
              <img src={arrowBlurple} />
              APP ENVIRONMENT
              <p>{this.props.appEnvironment.environment} <span>|</span> {this.props.appEnvironment.network}</p>
            </a>
          </div>
          <a className={"cta-next " + (this.state.appNameValid ? '' : 'disabled')} href='#' onClick={(e) => this.handleSubmit(e)}>
            GENERATE SIGNING KEY
            <img src={arrowWhite} />
          </a>
        </footer>
      </section>
      <CancelModal show={cancelModal} onClose={this.hideCancelModal} />
    </div>)
  }
}

const LabelRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 20px;
`
const Subtle = styled.span`
  font-weight: 400;
  text-transform: none;
`
const Tooltip = styled.div`
  position: relative;
  z-index: 2;
`
Tooltip.Hotspot = styled.div`
  border: solid 1px #8986A0;
  border-radius: 50%;
  color: #8986A0;
  cursor: pointer;
  font-size: 10px;
  height: 17px;
  line-height: 17px;
  position: relative;
  text-align: center;
  width: 17px;
  z-index: 4;
`
Tooltip.Popover = styled.div`
  opacity: 0;
  padding-top: 35px;
  position: absolute;
  right: -20px;
  top: 0;
  visibility: hidden;
  transition: opacity 0.3s, visibility 0.3s;

  ${Tooltip}:hover & {
    opacity: 1;
    visibility: visible;
  }
`
Tooltip.Body = styled.div`
  background: #fcf2e5;
  border: solid 1px #ffe1bd;
  border-radius: 4px;
  color: #5f5d68;
  padding: 20px;
  width: 237px;
  &:before {
    background: #fcf2e5;
    border-left: solid 1px #ffe1bd;
    border-bottom: solid 1px #ffe1bd;
    content: "";
    display: block;
    height: 16px;
    right: 24px;
    position: absolute;
    top: 28px;
    transform: rotate(135deg);
    width: 16px;
    z-index: 3;
  }
  p {
    font-size: 0.85em;
    margin: 0;
    padding: 0;
  }
`
Tooltip.Header = styled.h5`
  border-bottom: solid 1px rgba(95, 93, 104, 0.5);
  font-size: 0.8em;
  margin: 0 0 10px;
  padding: 0 0 5px;
  text-transform: uppercase;
`

export default AppDetails

import React, { Component } from 'react'
import { addFile } from '../../../utilities/ipfs'
import errorIcon from '../../../images/error-icon.svg'
import myAppsBg from '../../../images/myapps-bg.svg'
import '../../../layouts/css/myapps.css'

class AppDetails extends Component {
  constructor (props) {
    super(props)
    this.state = {
      appName: '',
      appURL: '',
      appDescription: '',
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
  render () {
    const bgImageStyle = {backgroundImage: this.state.ipfsLogoHash ? `url(https://ipfs.io/ipfs/${this.state.ipfsLogoHash})` : `url(${myAppsBg})`}
    return (
      <section className='startBuilding'>
        <header>
          <h2>Add App Details</h2>
          <a href='/' className='cancel'>CANCEL</a>
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
            <label htmlFor='appURL'>URL Address (optional)</label>
            <input type='text' id='appURL' placeholder='https://yourapphomepage.com' value={this.state.appURL} onChange={(e) => { this.handleAppURLChange(e) }} />
            <label htmlFor='appDescription'>App Description (optional)</label>
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
        <div className={`myapps-button`}>
          <a href='#' onClick={(e) => this.handleSubmit(e)}>
            Save
          </a>
        </div>
        <canvas width='100' height='100' id='canvas' style={{visibility: 'hidden'}} />
      </section>
    )
  }
}

export default AppDetails

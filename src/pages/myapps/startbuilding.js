import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from 'react-select'
import SiteHeader from '../../components/Layout/Header'
import config from '../../../data/SiteConfig'
import errorIcon from '../../images/error-icon.svg'
import '../../layouts/css/myapps.css'
import { Connect } from 'uport-connect'

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
    console.log(this.props.currentApp)
    this.state = {
      appName: this.props.currentApp.name || '',
      network: this.props.currentApp.configuration.network || 'mainnet',
      accountType: this.props.currentApp.configuration.accountType || 'keypair',
      selectedNetworkObj: networkOptions.filter(obj => { return obj.value === this.props.currentApp.configuration.network }) || networkOptions[0],
      appNameValid: false,
      formSubmitted: false
    }
    this.handleAppNameChange = this.handleAppNameChange.bind(this)
    this.handleNetworkChange = this.handleNetworkChange.bind(this)
    this.handleAccountTypeChange = this.handleAccountTypeChange.bind(this)
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
          <BodyContainer className='appMgrBody'>
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

const mapDispatchToProps = dispatch => {
  return { setCurrentApp: (app) => dispatch({ type: `SET_CURRENT_APP`, app: app }) }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAppsStartBuildingPage)

import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from 'react-select'
import SEO from '../../components/SEO/SEO'
import SiteHeader from '../../components/Layout/Header'
import config from '../../../data/SiteConfig'
import '../../layouts/css/appmanager.css'
import Connect from 'uport-connect'

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

class AppManagerStartBuildingPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      appName: '',
      network: 'mainnet',
      accountType: 'keypair',
      selectedNetworkObj: networkOptions[0]

    }
    this.handleAppNameChange = this.handleAppNameChange.bind(this)
    this.handleNetworkChange = this.handleNetworkChange.bind(this)
    this.handleAccountTypeChange = this.handleAccountTypeChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }
  componentWillMount () {
    if (Object.keys(this.props.profile).length === 0) {
      const history = this.props.history
      history.push('/appmanager/')
    }
    document.addEventListener('mousedown', this.handleOutsideClick, false)
  }
  componentWillUnMount () {
    document.removeEventListener('mousedown', this.handleOutsideClick, false)
  }
  handleAppNameChange (e) {
    this.setState({appName: e.target.value})
  }
  handleNetworkChange (selectedOption) {
    this.setState({ network: selectedOption.value, selectedNetworkObj: selectedOption })
  }
  handleAccountTypeChange (e) {
    this.setState({accountType: e.target.value})
  }
  handleSubmit (e) {
    e.preventDefault()
    const history = this.props.history

    const claim = {
      'uport-app': {
        name: this.state.appName,
        network: this.state.network,
        accountType: this.state.accountType
      }
    }
    try {
      // TODO put this in a global
      const uPortConnect = new Connect('AppManager')
      // debugger
      uPortConnect.attest({sub: this.props.profile.did, claim: claim}, 'CREATE-APP')
      uPortConnect.onResponse('CREATE-APP').then(payload => {
        console.log('=== CREATEAPP RESPONSE ===')
        console.log(payload)
        /* history.push('/appmanager/getstarted') */
      })
    } catch (e) {
      console.log(e)
    }

    this.props.saveApp({appName: this.state.appName, network: this.state.network, accountType: this.state.accountType})

    history.push('/appmanager/sample-code')
  }
  render () {
    const postEdges = this.props.data.allMarkdownRemark.edges
    let selectedNetwork = this.state.selectedNetworkObj
    return (
      <div className='index-container'>
        <Helmet title={config.siteTitle} />
        <main>
          <AppManagerHeadContainer>
            <SiteHeader
              activeCategory={''}
              location={this.props.location}
              categories={this.props.data.navCategories} />
          </AppManagerHeadContainer>
          <BodyContainer className='appMgrBody'>
            <form onSubmit={(e) => { this.handleSubmit(e) }}>
              <div className={'Grid Grid--gutters'}>
                <div className='Grid-cell sidebar'>
                  <h4>Register an app</h4>
                  <ul>
                    <li className='active'><a href='/'>App Details</a></li>
                    <li><a href='/'>Sample Code</a></li>
                  </ul>
                </div>
                <div className='Grid-cell'>
                  <h1>App Details</h1>
                  <label htmlFor='appName'>App Name</label>
                  <input type='text' id='appName' placeholder='Give your app a name' value={this.state.appName} onChange={(e) => { this.handleAppNameChange(e) }} />
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

const AppManagerHeadContainer = styled.div`
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

AppManagerStartBuildingPage.propTypes = {
  profile: PropTypes.object.isRequired,
  saveApp: PropTypes.func.isRequired
}

const mapStateToProps = ({ profile }) => {
  return { profile }
}

const mapDispatchToProps = dispatch => {
  return { saveApp: (app) => dispatch({ type: `SAVE_APP`, app: app }) }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppManagerStartBuildingPage)

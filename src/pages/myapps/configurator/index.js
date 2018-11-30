import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { connect } from 'react-redux'
import { addFile } from '../../../utilities/ipfs'

import SiteHeader from '../../../components/Layout/Header'
import config from '../../../../data/SiteConfig'
import logo from '../../../images/logo-mark-purple.svg'
import AppEnvironment from '../../../components/MyApps/Configurator/AppEnvironment'
import AppDetails from '../../../components/MyApps/Configurator/AppDetails'
import AppSigningKey from '../../../components/MyApps/Configurator/AppSigningKey'
import AppRegister from '../../../components/MyApps/Configurator/AppRegister'
import AppRegComplete from '../../../components/MyApps/Configurator/AppRegComplete'
import '../../../layouts/css/myapps.css'

const BodyContainer = styled.div`
  padding: 0;
  overflow: hidden;
`

class MyAppsConfigurator extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 1,
      appEnvironment: {
        environment: null,
        network: 'mainnet'
      },
      appDetails: {
        appName: '',
        appURL: '',
        appDescription: '',
        appIdentity: {}
      },
      appDomain: null,
      appProfileHash: null,
      pk: null
    }
    this.getChildState = this.getChildState.bind(this)
    this.nextStep = this.nextStep.bind(this);
    this.previousStep = this.previousStep.bind(this)
  }
  async getChildState (childName, childState) {
    let childStateObject = {}
    childStateObject[childName] = childState
    this.setState(childStateObject)
    this.nextStep()
    if (childName === 'appDetails') {
      await this.buildClaim()
    }
  }
  async buildClaim () {
    let profileClaim = {'name': this.state.appDetails.appName}
    if (this.state.appDetails.ipfsLogoHash) profileClaim['profileImage'] = {'/': `/ipfs/${this.state.appDetails.ipfsLogoHash}`}
    if (this.state.appDetails.ipfsBgHash) profileClaim['bannerImage'] = {'/': `/ipfs/${this.state.appDetails.ipfsBgHash}`}
    if (this.state.appDetails.appURL) profileClaim['url'] = this.state.appDetails.appURL
    if (this.state.appDetails.appDescription) profileClaim['description'] = this.state.appDetails.appDescription
    return new Promise(async (resolve, reject) => {
      const ipfsClaimHash = await this.uploadClaim(profileClaim)
      resolve(ipfsClaimHash)
    })
  }
  async uploadClaim (profileClaim) {
    let dataStr = JSON.stringify(profileClaim)
    const result = await addFile(dataStr)
    this.setState({ipfsProfileHash: result.Hash})
    console.log(`Uploaded profile claim: https://ipfs.io/ipfs/${result.Hash}`)
    return result.Hash
  }
  nextStep (e) {
    if(e)
      e.preventDefault()
    const { step, appEnvironment } = this.state
    if(step === 2 && appEnvironment.environment !== 'server')
      this.setState({ step: step + 2})
    else
      this.setState({ step: step + 1})
  }
  previousStep (e) {
    e.preventDefault()
    const { step, appEnvironment } = this.state
    if(step === 4 && appEnvironment.environment !== 'server')
      this.setState({ step: step - 2})
    else
      this.setState({ step: step - 1})
  }
  saveKey = pk => {
    this.setState({ pk })
  }
  render () {
    console.log(this.state.step)
    return (
      <div className='index-container' style={{minHeight: '100vh'}}>
        <Helmet title={config.siteTitle} />
        <main>
          {this.state.step == 4 
            ? <AppManagerHeadContainer>
                <SiteHeader
                  activeCategory={''}
                  location={this.props.location}
                  categories={this.props.data.navCategories} />
              </AppManagerHeadContainer>
            : null 
          }
          <BodyContainer>
            <div className={'configuratorWrap'}>
              {this.state.step !== 4 
                ? <span className={`brand w-nav-brand`}>
                    <Link to='/'>
                      <img src={logo} />
                    </Link>
                  </span>
                : null 
              }
              {(() => {
                switch (this.state.step) {
                  case 1:
                    return <AppEnvironment
                      appEnvironment={this.state.appEnvironment}
                      getChildState={this.getChildState} />
                  case 2:
                    return <AppDetails
                      uportApps={this.props.profile.uportApps}
                      appDetails={this.state.appDetails}
                      appEnvironment={this.state.appEnvironment}
                      getChildState={this.getChildState}
                      previousStep={this.previousStep} />
                  case 3:
                    if (this.state.appEnvironment.environment === 'server') {
                      return <AppSigningKey
                        appDetails={this.state.appDetails}
                        appEnvironment={this.state.appEnvironment}
                        getChildState={this.getChildState}
                        previousStep={this.previousStep}
                        onGenerateKey={this.saveKey} />
                    }
                  case 4:
                    return <AppRegComplete
                      profile={this.props.profile}
                      appDetails={this.state.appDetails}
                      appEnvironment={this.state.appEnvironment}
                      getChildState={this.getChildState}
                      saveApps={this.props.saveApps}
                      setCurrentApp={this.props.setCurrentApp}
                      ipfsProfileHash={this.state.ipfsProfileHash}
                      signingKey={this.state.pk} />
                  default :
                    return <AppEnvironment getChildState={this.getChildState} />
                }
              })()}
            </div>
          </BodyContainer>
        </main>
      </div>
    );
  }
}

export const pageQuery = graphql`
query MyAppsConfiguratorQuery {
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


const AppManagerHeadContainer = styled.div`
  background: ${props => props.theme.brand}
`

MyAppsConfigurator.propTypes = {
  profile: PropTypes.object.isRequired,
  saveProfile: PropTypes.func.isRequired
}

const mapStateToProps = ({ profile }) => {
  return { profile }
}

const mapDispatchToProps = dispatch => {
  return {
    saveProfile: (profile) => dispatch({ type: `SAVE_PROFILE`, profile: profile }),
    saveApps: (apps) => dispatch({ type: `SAVE_APPS`, uportApps: apps }),
    setCurrentApp: (app) => dispatch({ type: `SET_CURRENT_APP`, app: app })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAppsConfigurator)

import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { Connect } from 'uport-connect'
import { connect } from 'react-redux'

import SiteHeader from '../../components/Layout/Header'
import config from '../../../data/SiteConfig'
import appMgrBg from '../../images/appmgr-bg.svg'
import uportLogo from '../../images/Horizontal-Logo-purple.svg'
import '../../layouts/css/appmanager.css'

const BodyContainer = styled.div`
  padding: 0;
  overflow: hidden;
  .appmgr-start-right {
    height: 100vh;
    background-image: url(${appMgrBg})
  }
`

class AppManagerPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      uri: {},
      profile: {},
      showImage: false,
      showResult: false,
      showExample: false,
      showProfile: false
    }
    this.loginRequest = this.loginRequest.bind(this)
  }
  loginRequest (e) {
    e.preventDefault()
    const history = this.props.history
    try {
      const uPortConnect = new Connect('AppManager')
      uPortConnect.requestDisclosure({requested: ['name'], notifications: true})
      uPortConnect.onResponse('disclosureReq').then(payload => {
        this.setState({showImage: false, showResult: true, profile: {name: payload.name, did: payload.did}})
        this.props.saveProfile(this.state.profile)
        history.push('/appmanager/getstarted')
      })
    } catch (e) {
      console.log(e)
    }
  }
  render () {
    const postEdges = this.props.data.allMarkdownRemark.edges
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
            <div className={'Grid Grid--gutters'}>
              <div className='Grid-cell appmgr-start-left-wrap'>
                <div className='appmgr-start-left'>
                  <h1 className='title'>Decentralized Identity for Decentralized Applications</h1>
                  <p>Seamless login. Ethereum transaction signing. User credential issuance and consumption.</p>
                  <div className={`appmgr-button`}>
                    <a href='#' onClick={(e) => { this.loginRequest(e) }}>
                      Login with uPort
                    </a>
                  </div>
                </div>
              </div>
              <div className='Grid-cell appmgr-start-right' />
            </div>
          </BodyContainer>
        </main>
      </div>
    );
  }
}

const AppManagerHeadContainer = styled.div`
  background: ${props => props.theme.brand}
`

export const pageQuery = graphql`
query AppManagerQuery {
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

const IndexHeadContainer = styled.div`
  background: ${props => props.theme.brand};
`

AppManagerPage.propTypes = {
  profile: PropTypes.object.isRequired,
  saveProfile: PropTypes.func.isRequired
}

const mapStateToProps = ({ profile }) => {
  return { profile }
}

const mapDispatchToProps = dispatch => {
  return { saveProfile: (profile) => dispatch({ type: `SAVE_PROFILE`, profile: profile }) }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppManagerPage)

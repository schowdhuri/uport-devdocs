import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { uPortConnect } from '../../utilities/uPortConnectSetup'
import { connect } from 'react-redux'

import config from '../../../data/SiteConfig'
import myAppsBg from '../../images/myapps-bg.svg'
import greenTick from '../../images/greenTick.svg'
import '../../layouts/css/myapps.css'

const BodyContainer = styled.div`
  padding: 0;
  overflow: hidden;
  ul {
     margin-top: 1em;
     list-style: none;
     padding-left: 20px;
  }
  ul li {
    line-height: 32px;
    font-size: 20px;
  }
  ul li::before {
    content: '';
    color: #62B482;
    display: inline-block;
    width: 1em;
    height: 1em;
    margin-right: 15px;
    vertical-align: middle;
    text-align: center;
    position: relative;
    bottom: 2px;
    direction: rtl;
    background-image: url(${greenTick});
    background-size: contain;
    background-repeat: no-repeat;
  }
  .myapps-start-right {
    height: 100vh;
    background-image: url(${myAppsBg})
  }
`

class MyApps extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      environment: null
    }
    this.loginRequest = this.loginRequest.bind(this)
  }
  loginRequest (e) {
    e.preventDefault()
    const history = this.props.history
    try {
      uPortConnect.requestDisclosure({requested: ['name'], verified: ['uport-apps'], notifications: true})
      uPortConnect.onResponse('disclosureReq').then(response => {
        this.props.saveProfile({name: response.payload.name, did: response.payload.did, uportApps: response.payload['uport-apps']})
        if (this.props.profile.uportApps) {
          history.push('/myapps/list')
        } else {
          history.push('/myapps/configurator')
        }
      })
    } catch (e) {
      console.log(e)
    }
  }
  render () {
    return (
      <div className='index-container'>
        <Helmet title={config.siteTitle} />
        <main>
          <BodyContainer>
            <div className={'Grid Grid--gutters'}>
              <div className='Grid-cell myapps-start-left-wrap'>
                <div className='myapps-start-left'>
                  <h1 className='title'>Decentralized Identity for Decentralized Applications</h1>
                  <ul>
                    <li>Seamless login.</li>
                    <li>Ethereum transaction signing.</li>
                    <li>User credential issuance and consumption</li>
                  </ul>
                  <div className={`myapps-button`}>
                    <a href='#' onClick={(e) => { this.loginRequest(e) }}>
                      Register Your App with uPort
                    </a>
                  </div>
                  <div className='headsUp'>
                    <p><strong>Heads up! </strong>Have your mobile phone handy.</p>
                  </div>
                </div>
              </div>
              <div className='Grid-cell myapps-start-right' />
            </div>
          </BodyContainer>
        </main>
      </div>
    )
  }
}

export const pageQuery = graphql`
query MyAppsQuery {
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

MyApps.propTypes = {
  profile: PropTypes.object.isRequired,
  saveProfile: PropTypes.func.isRequired
}

const mapStateToProps = ({ profile }) => {
  return { profile }
}

const mapDispatchToProps = dispatch => {
  return { saveProfile: (profile) => dispatch({ type: `SAVE_PROFILE`, profile: profile }) }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyApps)

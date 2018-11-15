import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { uPortConnect } from '../../../utilities/uPortConnectSetup'
import { transport, message } from 'uport-transports'
import { connect } from 'react-redux'
import Link from 'gatsby-link'

import config from '../../../../data/SiteConfig'
import logo from '../../../images/logo-mark-purple.svg'
import appStoreBadge from '../../../images/app-store-badge.svg'
import playStoreBadge from '../../../images/google-play-badge.svg'
import '../../../layouts/css/myapps.css'

const BodyContainer = styled.div`
  padding: 0;
  overflow: hidden;
`

class MyAppsRegister extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      qrImageURI: ''
    }
    this.uriHandler = this.uriHandler.bind(this)
  }
  componentDidMount () {
    const chasquiCallback = transport.messageServer.genCallback()
    console.log(chasquiCallback)
    console.log(uPortConnect)
    uPortConnect.credentials.createDisclosureRequest().then({
      requested: ['name'],
      verified: ['uport-apps'],
      notifications: true,
      callbackUrl: chasquiCallback
    }).then(requestToken => {
      const uri = message.util.paramsToQueryString(message.util.messageToURI(requestToken), {callback_type: 'post'})
      this.setState({qrImageURI: transport.ui.getImageDataURI(uri)})  
      // Poll Chasqui?
      transport.messageServer.poll(chasquiCallback).then(response => {
        console.log(response)
      })
      /*
      uPortConnect.credentials.authenticateDisclosureResponse(requestToken).then(creds => {
        console.log(creds)
      }).catch(err => {
        console.log(err)
      })
      */
    })
  }
  uriHandler (thing) {
    console.log(thing)
  }
  render () {
    return (
      <div className='index-container'>
        <Helmet title={config.siteTitle} />
        <main>
          <BodyContainer>
            <div className={'configuratorWrap'}>
              <span className={`brand w-nav-brand`}>
                <Link to='/'>
                  <img src={logo} />
                </Link>
              </span>
              <section>
                <header>
                  <h2>First things, first...</h2>
                  <a href='/' className='cancel'>CANCEL</a>
                </header>
                <div className='module'>
                  <span className='step'>1</span>
                  <h4>Download uPort App</h4>
                  <img className='storeBadge' src={playStoreBadge} />
                  <img className='storeBadge' src={appStoreBadge} />
                </div>
                <div className='module'>
                  <span className='step'>2</span>
                  <h4>Scan this QR code with the uPort Wallet App to login.</h4>
                  <img src={this.state.qrImageURI} />
                </div>
              </section>
            </div>
          </BodyContainer>
        </main>
      </div>
    );
  }
}

export const pageQuery = graphql`
query MyAppsRegisterQuery {
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

MyAppsRegister.propTypes = {
  profile: PropTypes.object.isRequired,
  saveProfile: PropTypes.func.isRequired
}

const mapStateToProps = ({ profile }) => {
  return { profile }
}

const mapDispatchToProps = dispatch => {
  return { saveProfile: (profile) => dispatch({ type: `SAVE_PROFILE`, profile: profile }) }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAppsRegister)

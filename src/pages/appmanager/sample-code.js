import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SEO from '../../components/SEO/SEO'
import SiteHeader from '../../components/Layout/Header'
import config from '../../../data/SiteConfig'
import '../../layouts/css/appmanager.css'

const BodyContainer = styled.div`
background-color: #f9f9fa;
height: 100%;
min-height: 100vh;
.sampleInstructions {
  width: 80%;
  max-width: 720px;
}
.sampleInstructions ul {
  counter-reset: stepNumber;
  padding-left: 0;
}
.sampleInstructions ul li {
  position: relative;
  list-style-type: none;
  padding-left: 40px;
  margin-bottom: 40px;
}
.sampleInstructions ul li:before {
  counter-increment: stepNumber;
  content: counter(stepNumber);
  position: absolute;
  background-color: #6958cd;
  color: #fff;
  font-weight: 700;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  text-align: center;
  padding-top: 4px;
  left: 0;
}
.sampleInstructions h3 {
  font-weight: 200;
  font-size: 20px;
  margin-bottom: 20px;
}
.sampleCode {
  background-color: #f4f4f7;
  border-radius: 3px;
  padding: 20px;
  font-family: Courier;
  color: #8380fc;
}
.sampleCode span {
  display: block;
  white-space: nowrap;
}
`

class AppManagerSampleCodePage extends React.Component {
  componentDidMount () {
    if (Object.keys(this.props.profile).length === 0) {
      const history = this.props.history
      history.push('/appmanager/')
    }
  }
  render () {
    const postEdges = this.props.data.allMarkdownRemark.edges
    return (
      <div className='index-container appmgr'>
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
              <div className='Grid-cell sidebar'>
                <h4>Register an app</h4>
                <ul>
                  <li><a href='/appmanager/startbuilding'>App Details</a></li>
                  <li className='active'><a href='#'>App Code</a></li>
                </ul>
              </div>
              <div className='Grid-cell'>
                <h1>App Code</h1>
                <div className={'Grid Grid--gutters'}>
                  <div className='Grid-cell sampleInstructions'>
                    <ul>
                      <li>
                        <h3>Install Library</h3>
                        <div className='sampleCode'>
                          <span>npm install uport-connect</span>
                        </div>
                      </li>
                      <li>
                        <h3>Initialize uPort Connect</h3>
                        <div className='sampleCode'>
                          <span>import Connect from 'uport-connect'</span>
                          {this.props.currentApp.accountType === 'none'
                            ? <span>const uport = new Connect('{this.props.currentApp.appName}')</span>
                            : <span>const uport = new Connect('{this.props.currentApp.appName}', {'{'}network: '{this.props.currentApp.network}'{'}'})</span>
                          }
                        </div>
                      </li>
                      <li>
                        <h3>Request Credentials</h3>
                        <div className='sampleCode'>
                        <pre><code style={{backgroundColor: '#f4f4f7'}} className={`language-javascript`}>
                        {`uport.requestDisclosure({
  requested: ['name','country'],
  notifications: true
})
uport.onResponse('disclosureReq').then(payload => {
  const address = payload.res.address
})
                        `}
                        </code></pre>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <footer>
              <a href='/'>Having trouble getting your app set up? Get in touch with us.</a>
            </footer>
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
query AppManagerSnippetQuery {
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

AppManagerSampleCodePage.propTypes = {
  currentApp: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired
}

const mapStateToProps = ({ profile, currentApp }) => {
  return { profile, currentApp }
}

export default connect(mapStateToProps)(AppManagerSampleCodePage)

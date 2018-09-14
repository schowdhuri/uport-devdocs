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
`

class AppManagerSampleCodePage extends React.Component {
  render () {
    console.log(this.props.currentApp)
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
              <div className='Grid-cell sidebar'>
                <h4>Register an app</h4>
                <ul>
                  <li><a href='/'>App Details</a></li>
                  <li className='active'><a href='/'>Sample Code</a></li>
                </ul>
              </div>
              <div className='Grid-cell'>
                <h1>Sample Code</h1>
                <p>{JSON.stringify(this.props.currentApp)}</p>
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
  currentApp: PropTypes.object.isRequired
}

const mapStateToProps = ({ currentApp }) => {
  return { currentApp }
}

export default connect(mapStateToProps)(AppManagerSampleCodePage)

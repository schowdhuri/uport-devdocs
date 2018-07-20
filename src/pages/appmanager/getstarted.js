import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import {Connect, SimpleSigner} from 'uport-connect'
import { connect } from 'react-redux'

import SEO from '../../components/SEO/SEO'
import SiteHeader from '../../components/Layout/Header'
import config from '../../../data/SiteConfig'

const BodyContainer = styled.div`
`

class AppManagerGetStartedPage extends React.Component {
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
              <div className='Grid-cell'>
              <h1>Get started building.</h1>
                {(this.props.profile) && (
                  <p>
                    {JSON.stringify(this.props.profile)}
                  </p>
                )}
              </div>
            </div>
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
query AppManagerGetStartedQuery {
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

AppManagerGetStartedPage.propTypes = {
  profile: PropTypes.object.isRequired
}

const mapStateToProps = ({ profile }) => {
  return { profile }
}

export default connect(mapStateToProps)(AppManagerGetStartedPage)

import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SEO from '../../components/SEO/SEO'
import SiteHeader from '../../components/Layout/Header'
import config from '../../../data/SiteConfig'
import startBuilding from '../../images/start-building.svg'
import '../../layouts/css/myapps.css'

const BodyContainer = styled.div`
padding: 60px;
height: 100vh;
img {
  max-width: 240px;
  margin-top: 30px;
}
`

class MyAppsGetStartedPage extends React.Component {
  render () {
    const postEdges = this.props.data.allMarkdownRemark.edges
    return (
      <div className='index-container myAppsWrap getStarted'>
        <Helmet title={config.siteTitle} />
        <main>
          <AppManagerHeadContainer>
            <SiteHeader
              activeCategory={''}
              location={this.props.location}
              categories={this.props.data.navCategories} />
          </AppManagerHeadContainer>
          <BodyContainer className='myAppsBody'>
            <div className={'Grid Grid--gutters'}>
              <div className='Grid-cell startBuildingLeft'>
                <img src={startBuilding} />
              </div>
              <div className='Grid-cell'>
                <h1>Get started building.</h1>
                <p>Register your first app in less than 5 minutes.</p>
                <a href='/myapps/startbuilding' className='register-button'>
                  <span><strong>+</strong></span>
                  Register an App
                </a>
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

MyAppsGetStartedPage.propTypes = {
  profile: PropTypes.object.isRequired
}

const mapStateToProps = ({ profile }) => {
  return { profile }
}

export default connect(mapStateToProps)(MyAppsGetStartedPage)

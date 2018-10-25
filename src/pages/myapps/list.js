import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SiteHeader from '../../components/Layout/Header'
import AppList from '../../components/MyApps/AppList'
import config from '../../../data/SiteConfig'
import '../../layouts/css/myapps.css'

const BodyContainer = styled.div`
background-color: #f9f9fa;
height: 100%;
min-height: 100vh;
`

class MyAppsAppListPage extends React.Component {
  componentDidMount () {
    if (Object.keys(this.props.profile).length === 0) {
      this.props.history.push('/myapps/')
    }
  }
  render () {
    return (
      <div className='index-container myAppsWrap appListPage'>
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
              <div className='Grid-cell myapps'>
                <a href='/myapps/startbuilding' className='register-button'>
                  <span><strong>+</strong></span>
                  Register an App
                </a>
                <h1>My Apps</h1>
                <div className='appList'>
                  {this.props.profile.uportApps
                  ? <AppList history={this.props.history} />
                  : null
                  }
                </div>
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
query AppManagerMyAppsQuery {
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

MyAppsAppListPage.propTypes = {
  profile: PropTypes.object.isRequired
}

const mapStateToProps = ({ profile }) => {
  return { profile }
}

export default connect(mapStateToProps)(MyAppsAppListPage)

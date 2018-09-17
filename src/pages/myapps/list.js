import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SiteHeader from '../../components/Layout/Header'
import config from '../../../data/SiteConfig'
import '../../layouts/css/myapps.css'

const BodyContainer = styled.div`
background-color: #f9f9fa;
height: 100%;
min-height: 100vh;
`

const AppList = (props) => {
  const appItems = props.apps.map((app, index) =>
    <li className='appItem' key={index} onClick={(e) => { props.clickHandler(e, index) }}>
      <div className='appCover'>&nbsp;</div>
      <div className='avatar'>
        &nbsp;
      </div>
      <h3>{app.name}</h3>
      <span>{app.configuration.network}</span>
    </li>
  )
  return (
    <ul className='appList'>{appItems}</ul>
  )
}

class MyAppsAppListPage extends React.Component {
  constructor (props) {
    super(props)
    this.handleAppItemClick = this.handleAppItemClick.bind(this)
  }
  componentDidMount () {
    this.props.clearCurrentApp()
    if (Object.keys(this.props.profile).length === 0) {
      this.props.history.push('/myapps/')
    }
  }
  handleAppItemClick (event, index) {
    this.props.clearCurrentApp()
    this.props.setCurrentApp(this.props.profile.uportApps[index])
    this.props.history.push('/myapps/startbuilding')
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
                  <AppList apps={this.props.profile.uportApps} clickHandler={this.handleAppItemClick} />
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
  profile: PropTypes.object.isRequired,
  setCurrentApp: PropTypes.func.isRequired,
  clearCurrentApp: PropTypes.func.isRequired
}

const mapStateToProps = ({ profile, currentApp }) => {
  return { profile, currentApp }
}

const mapDispatchToProps = dispatch => {
  return {
    setCurrentApp: (app) => dispatch({ type: `SET_CURRENT_APP`, app: app }),
    clearCurrentApp: () => dispatch({ type: `CLEAR_CURRENT_APP` })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyAppsAppListPage)

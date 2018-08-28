import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SEO from '../../components/SEO/SEO'
import SiteHeader from '../../components/Layout/Header'
import config from '../../../data/SiteConfig'
import '../../layouts/css/appmanager.css'
import appMgrBg from '../../images/appmgr-bg.svg'

const BodyContainer = styled.div`
background-color: #f9f9fa;
height: 100%;
min-height: 100vh;
.myapps {
  width: 80%;
  margin: 0 auto;
  max-width: 800px;
}
.myapps h1 {
  font-size: 36px;
  color: #000;
}
.appList ul {
  padding-left: 0;
  margin-top: 40px;
}
.appItem {
  width: 26.65%;
  min-width: 220px;
  height: 220px;
  list-style-type: none;
  float: left;
  box-shadow: 0px 0px 12px 2px rgba(100,100,100,0.12);
  text-align: center;
  margin-right: 8%;
  margin-bottom: 40px;
  position: relative;
  cursor: pointer;
  border-radius: 3px;
}
.appItem .avatar {
  position: absolute;
  background-image: url(${appMgrBg});
  top: 15%;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  left: 26%;
  background-size: 350px;
  background-position: 6% 38%;
}
.appItem:nth-child(3n) {
  margin-right: 0;
}
.appCover {
  width: 100%;
  height: 40%;
  background-color: #5c54c7;
  margin-bottom: 60px;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
}
.appItem h3 {
  font-size: 18px;
  margin-bottom: -2px;
}
.appItem span {
  color: #89879f;
  font-size: 14px;
  text-transform: capitalize;
}
.register-button {
  float: right;
  margin-top: 40px;
  position: relative;
  font-size: 18px;
  padding: 14px 14px 14px 54px;
}
.register-button span {
  width: 32px;
  height: 32px;
  top: 8px;
}
.register-button span strong {
  color: #fff;
  text-align: center;
  font-size: 38px;
  line-height: 32px;
}
`

class AppList extends React.Component {
  render () {
    const appItems = this.props.apps.map((app, index) =>
      <li className='appItem' key={index} onClick={(e) => { this.props.clickHandler(e, index) }}>
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
}

class AppManagerMyAppsPage extends React.Component {
  constructor (props) {
    super(props)
    this.handleAppItemClick = this.handleAppItemClick.bind(this)
  }
  componentDidMount () {
    this.props.clearCurrentApp()
    if (Object.keys(this.props.profile).length === 0) {
      this.props.history.push('/appmanager/')
    }
  }
  handleAppItemClick (event, index) {
    this.props.clearCurrentApp()
    this.props.setCurrentApp(this.props.profile.uportApps[index])
    this.props.history.push('/appmanager/startbuilding')
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
              <div className='Grid-cell myapps'>
                <a href='/appmanager/startbuilding' className='register-button'>
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

AppManagerMyAppsPage.propTypes = {
  profile: PropTypes.object.isRequired
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

export default connect(mapStateToProps, mapDispatchToProps)(AppManagerMyAppsPage)

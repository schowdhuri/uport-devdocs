import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import SiteHeader from '../../components/Layout/Header'
import myAppsBg from '../../images/myapps-bg.svg'
import config from '../../../data/SiteConfig'
import '../../layouts/css/myapps.css'

const BodyContainer = styled.div`
background-color: #f9f9fa;
margin-top: 20px !important;
padding-bottom: 60px;
height: 100%;
img {
  max-width: 240px;
  margin-top: 30px;
}
.detailsContainer {
  box-shadow: 0px 0px 4px rgba(0,0,0, 0.25);
  border-radius: 4px;
  margin: 40px 0;
  background-color: #fff;
  padding: 40px;
  clear: both;
}
.field {
  border-bottom: 0.5px solid #dadada;
  margin-bottom: 20px;
}
.field h4 {
  text-transform: uppercase;
  color: #8986A0;
  font-size: 14px;
  line-height: 19px;
}
.field p {
  color: #3F3D4B;
  font-size: 18px
  line-height: 32px;
  margin-bottom: 10px;
  font-weight: 400;
  text-transform: capitalize;
}
.detailsContainer .appItem {
  width: 45%;
  min-width: 250px;
  height: 250px;
  margin: 0 auto;
  display: inline-block;
  float: none;
}
.detailsContainer .appItem .avatar {
  left: 29%;
}
.previewContainer {
  text-align: center;
  padding-top: 20px;
}
.previewContainer p {
  text-align: left;
  margin: 0 auto;
  font-size: 16px;
  line-height: 20px;
  display: inline-block;
  margin-top: 30px;
  width: 45%;
  min-width: 250px;
}
.returnLink {
  float: right;
  color: #8986A0;
  margin: 20px 0;
  text-decoration: none;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 14px;
  line-height: 32px;
  padding-right: 5px;
}
.appDetailHeaderWrap .appDetailHeader {
  width: 80%;
  margin: 0 auto;
  max-width: 800px;
}
@media screen and (max-width: 600px) {
    .appDetailHeaderWrap {
      margin-top: 60px;
    }
    .detailsContainer .Grid {
      display: block;
    }
    .detailsContainer .Grid-cell {
      width: 100%;
      min-width: 100%;
    }
    .previewContainer .appItem, .previewContainer p {
      width: 45%;
      min-width: 190px;
    }
    .detailsContainer .appItem .avatar {
      left: 24%;
    }
    .returnLink {
      float:left;
    }
  }
`

class AppDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      bgImageStyle: {},
      ipfsLookupDone: false
    }
  }
  getProfileImage (app) {
    if (app.configuration.profile) {
      let profileClaim = 'https://ipfs.io' + app.configuration.profile['/']
      let that = this
      fetch(profileClaim).then(function (response) {
        if (response.status >= 400) { console.log('Bad response from IPFS') }
        return response.json()
      }).then(function (data) {
        let profileImageUrl = 'https://ipfs.io' + data.profileImage['/']
        that.setState({bgImageStyle: {backgroundImage: `url(${profileImageUrl})`}, ipfsLookupDone: true})
      })
    } else {
      this.setState({bgImageStyle: {backgroundImage: `url(${myAppsBg})`}, ipfsLookupDone: true})
    }
  }
  render () {
    if (!this.state.ipfsLookupDone) this.getProfileImage(this.props.currentApp)
    console.log(this.props.currentApp)
    return (
      Object.keys(this.props.profile).length
      ? <div className='index-container myAppsWrap getStarted'>
        <Helmet title={config.siteTitle} />
        <main>
          <AppManagerHeadContainer>
            <SiteHeader
              activeCategory={''}
              location={this.props.location}
              categories={this.props.data.navCategories} />
          </AppManagerHeadContainer>
          <div className='appDetailHeaderWrap'>
            <div className='appDetailHeader'>
              <div className={'avatar ' + (this.props.currentApp.configuration.profile ? 'uploaded' : 'default')} style={this.state.bgImageStyle}>&nbsp;</div>
              <h3>{this.props.currentApp.name}</h3>
            </div>
          </div>
          <BodyContainer className='myAppsBody'>
            <a href='/myapps/list' className='returnLink'>Return to My Apps</a>
            <div className='detailsContainer'>
              <div className={'Grid Grid--gutters'}>
                <div className='Grid-cell'>
                  <div className='field'>
                    <h4 className='label'>App Name</h4>
                    <p>{this.props.currentApp.name}</p>
                  </div>
                  <div className='field'>
                    <h4 className='label'>Network</h4>
                    <p>{this.props.currentApp.configuration.network}</p>
                  </div>
                  <div className='field'>
                    <h4 className='label'>Account Type</h4>
                    <p>{this.props.currentApp.configuration.accountType}</p>
                  </div>
                </div>
                <div className='Grid-cell previewContainer'>
                  <div className='appItem'>
                    <div className='appCover' style={{backgroundColor: this.props.currentApp.configuration.accentColor || '#5c54c7'}}>&nbsp;</div>
                    <div className={'avatar ' + (this.props.currentApp.configuration.profile ? 'uploaded' : 'default')} style={this.state.bgImageStyle}>&nbsp;</div>
                    <h3>{this.props.currentApp.name}</h3>
                    <span>{this.props.currentApp.configuration.network}</span>
                  </div>
                  <p>This is how users see your app in their uPort mobile app.</p>
                </div>
              </div>
            </div>
          </BodyContainer>
        </main>
      </div>
      : this.props.history.push('/myapps')
    )
  }
}

const AppManagerHeadContainer = styled.div`
  background: ${props => props.theme.brand}
`

export const pageQuery = graphql`
query AppDetailQuery {
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

AppDetail.propTypes = {
  profile: PropTypes.object.isRequired,
  currentApp: PropTypes.object.isRequired
}

const mapStateToProps = ({ profile, currentApp }) => {
  return { profile, currentApp }
}

export default connect(mapStateToProps)(AppDetail)

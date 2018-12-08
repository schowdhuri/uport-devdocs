import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Link from 'gatsby-link'
import SiteHeader from '../../components/Layout/Header'
import { Container, Grid, Col, Spacer, small } from '../../layouts/grid'
import AppCode from '../../components/MyApps/AppList.Code'
import Details from '../../components/MyApps/AppList.Details'
import myAppsBg from '../../images/myapps-bg.svg'
import config from '../../../data/SiteConfig'
import '../../layouts/css/myapps.css'

class AppDetail extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: "details"
    }
  }
  changeTab = tabId => () => {
    if(this.state.tab != tabId)
      this.setState({ tab: tabId })
  }
  render () {
    const { tab } = this.state
    const bgImageStyle = (this.props.currentApp.configuration.profileImage
      ? {backgroundImage: `url(https://ipfs.io${this.props.currentApp.configuration.profileImage})`}
      : {backgroundImage: `url(${myAppsBg})`})
    console.log(bgImageStyle)
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
              <div className={'avatar ' + (this.props.currentApp.configuration.profileImage ? 'uploaded' : 'default')} style={bgImageStyle}>&nbsp;</div>
              <h3>{this.props.currentApp.name}</h3>
            </div>
            <Tabbar>
              <Container>
                <Grid>
                  <Spacer span={1} />
                  <Col span={10}>
                    <Tab active={tab=='details'} onClick={this.changeTab('details')}>App Details</Tab>
                    <Tab active={tab=='code'} onClick={this.changeTab('code')}>App Code</Tab>
                  </Col>
                  <Spacer span={1} />
                </Grid>
              </Container>
            </Tabbar>
          </div>
          <BodyContainer>
            <Grid>
              <Spacer span={1} />
              <Col span={10}>
                <Link to='/myapps/list' className='returnLink'>Return to My Apps</Link>
              </Col>
              <Spacer span={1} />
              <Spacer span={1} />
              <Col span={10}>
                {tab == 'details'
                  ? <Details
                      currentApp={this.props.currentApp}
                      bgImageStyle={bgImageStyle} />
                  : <AppCode currentApp={this.props.currentApp} />}
              </Col>
              <Spacer span={1} />
            </Grid>
          </BodyContainer>
        </main>
      </div>
      : this.props.history.push('/myapps')
    )
  }
}

const BodyContainer = styled(Container)`
  background-color: #f9f9fa;
  margin-top: 20px !important;
  padding-bottom: 60px;
  img {
    max-width: 240px;
    margin-top: 30px;
  }
  .detailsContainer {
    box-shadow: 0px 0px 4px rgba(0,0,0, 0.25);
    border-radius: 4px;
    background-color: #fff;
    padding: 40px;
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
    // min-width: 250px;
    height: 250px;
    margin: 0 auto;
    display: inline-block;
    float: none;
  }
  .previewContainer {
    text-align: center;
    padding-top: 20px;
  }
  .previewContainer p {
    text-align: center;
    margin: 0 auto;
    font-size: 16px;
    line-height: 20px;
    display: block;
    margin-top: 30px;
    width: 45%;
  }
  .returnLink {
    float: right;
    color: #8986A0;
    margin: 20px 0 0;
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
  ${small(`
    .detailsContainer {
      padding: 20px;
    }
  `)}
`
const AppManagerHeadContainer = styled.div`
  background: ${props => props.theme.brand}
`
const Tabbar = styled.div`
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
`
const Tab = styled.button`
  background: none
  border: none;
  color: #8986A0;
  margin-right: 10px;
  outline-width: 0.5px;
  padding: 5px;
  text-transform: uppercase;
  ${props => props.active
    ? `
      color: #5C50CA;
      &::after {
        background: #5C50CA;
        bottom: -5px;
        content: "";
        display: block;
        height: 3px;
        position: relative;
      }
    ` : ''}
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

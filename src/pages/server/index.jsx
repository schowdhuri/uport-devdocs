import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import SEO from '../../components/SEO/SEO'
import SiteHeader from '../../components/Layout/Header'
import SiteFooter from '../../components/Layout/Footer'
import ServerHero from '../../components/server/ServerHero'
import ServerLanding from '../../components/server/ServerLanding'
import ServerValueProp from '../../components/server/ServerValueProp'
import ServerSolutions from '../../components/server/ServerSolutions'
import ServerResources from '../../components/server/ServerResources'
import config from '../../../data/SiteConfig'
import heroImg from '../../images/Image.svg'
import AutoLinkText from 'react-autolink-text2'
import bgPattern from '../../images/bg-pattern-gray.svg'

class Server extends React.Component {
  render () {
    const postEdges = this.props.data.allMarkdownRemark.edges
    return (
      <div className='index-container'>
        <Helmet title={config.siteTitle} />
        <SEO postEdges={postEdges} />
        <main>
          <IndexHeadContainer>
            <SiteHeader
              activeCategory={''}
              location={this.props.location}
              categories={this.props.data.navCategories} />
          </IndexHeadContainer>
          <ServerHero />
          <BodyContainer className={`body-container`}>
            <ServerValueProp />
            <ServerSolutions />
            <ServerResources />
          </BodyContainer>
          <FooterContainer>
            <SiteFooter />
          </FooterContainer>
        </main>
      </div>
    );
  }
}

export default Server

const IndexHeadContainer = styled.div`
  background: ${props => props.theme.brand};
  header {
    width: 90vw;
    margin: 0 auto;
  }
  h4 {
    font-style: normal;
    font-weight: 800;
    line-height: 24px;
    font-size: 18px;
  }
  .Grid, .Grid-cell {
    word-wrap: break-word
  }
  .Grid--gutter {

  }
`

const BodyContainer = styled.div`
  background: #f9f9fa url(${bgPattern});
  background-size: 60%;
  margin: 0 auto;
`

const FooterContainer = styled.footer`
  background-color: #6c59cf;
  clear: all;
`

/* eslint no-undef: "off"*/
export const pageQuery = graphql`
  query ServerQuery {
    allMarkdownRemark(
      limit: 2000
      filter: { frontmatter: { type: { ne: null }}}
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
    announcement: allMarkdownRemark(
      filter: { frontmatter: { announcement: { ne: null } } }) {
        totalCount
        edges {
          node {
            frontmatter {
              announcement
            }
          }
        }
      }
  }
`;

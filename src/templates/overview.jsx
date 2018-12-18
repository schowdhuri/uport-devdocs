import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import RehypeReact from 'rehype-react'
import AutoLinkText from 'react-autolink-text2'
import SEO from '../components/SEO/SEO'
import SiteHeader from '../components/Layout/Header'
import DevSurvey from '../components/Survey.jsx'
import config from '../../data/SiteConfig'
import TableOfContents from '../components/Layout/TableOfContents'
import SecondaryTitle from '../components/Layout/html/SecondaryTitle'
import OrderedList from '../components/Layout/html/OrderedList'
import UnorderedList from '../components/Layout/html/UnorderedList'
import CtaButton from '../components/CtaButton'
import Announcement from '../components/Announcement'
import getHeadings from "../utilities/getHeadings"
import Link from 'gatsby-link'

export default class OverviewTemplate extends React.Component {
  getContentWindow = () => this.contentWindow
  render () {
    const renderAst = new RehypeReact({
      createElement: React.createElement,
      components: {
        h2: SecondaryTitle,
        ul: UnorderedList,
        ol: OrderedList,
        a: props => !props.href || props.href.match(/^https?:\/\//)
          ? <a {...props} />
          : <Link to={props.href} {...props} />
      }
    }).Compiler
    const { slug } = this.props.pathContext
    const postNode = this.props.data.postBySlug
    const post = postNode.frontmatter
    const type = post.type
    const types = []
    const messages = []

    this.props.data.postByCategory.edges.forEach(_type => {
      if (_type.node.frontmatter.type === type) {
        types.push(_type)
      }
    })

    const chapterTitles = []
    types.forEach(_type => {
      chapterTitles.push(_type.node.frontmatter.title)
    })

    if (!post.id) {
      post.id = slug
    }
    if (!post.id) {
      post.category_id = config.postDefaultCategoryID
    }
    return (
      <div>
        <Helmet>
          <title>{`${post.title} | ${config.siteTitle}`}</title>
        </Helmet>
        <SEO postPath={slug} postNode={postNode} postSEO />
        <BodyGrid>
          <HeaderContainer>
            <SiteHeader
              activeType={type}
              location={this.props.location}
              types={this.props.data.navTypes}
            />
          </HeaderContainer>
          <ToCContainer>
            <TableOfContents
              post={post}
              types={types}
              headings={getHeadings(postNode.htmlAst)}
              getContentWindow={this.getContentWindow}
            />
          </ToCContainer>
          <BodyContainer innerRef={ref => this.contentWindow=ref}>
            <Announcement data={this.props.data} />
            <CtaButton to={`${post.source}`}>
              Edit
            </CtaButton>
            <div className={`docSearch-content`}>
              { renderAst(postNode.htmlAst) }
            </div>
            <DevSurvey />
          </BodyContainer>
        </BodyGrid>
      </div>
    )
  }
}

const BodyGrid = styled.div`
  height: 100vh;
  display: grid;
  grid-template-rows: 60px 1fr;
  grid-template-columns: 300px 1fr;

  @media screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    height: inherit;
  }
`

const BodyContainer = styled.div`
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  overflow: scroll;
  justify-self: center;
  width: 100%;
  padding: ${props => props.theme.sitePadding};
  @media screen and (max-width: 600px) {
    order: 2;
  }

  & > div {
    max-width: ${props => props.theme.contentWidthLaptop};
    margin-left: ${props => props.theme.bobbysLeftMarginPreference};
    margin-top: auto;
    margin-right: auto;
    margin-bottom: auto;
  }

  & > h1 {
    color: ${props => props.theme.accentDark};
  }
  h2 {
    margin-top: 60px;
  }
  @media screen and (max-width: 1068px) {
    & > div {
      max-width: ${props => props.theme.contentWidthTablet};
      margin-left: ${props => props.theme.gregsLeftMarginPreference};
    }
  }
  @media screen and (max-width: 768px) {
    & > div {
      max-width: ${props => props.theme.contentWidthLargePhone};
    }
  }
  @media screen and (max-width: 520px) {
    & > div {
      max-width: ${props => props.theme.contentWidthLaptop};
    }
  }
`

const HeaderContainer = styled.div`
  background: ${props => props.theme.brand};
  width: 100vw;
  .Grid {
    width: 90vw;
    margin: 0 auto;
  }
`

const ToCContainer = styled.div`
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  overflow: scroll;

  ::-webkit-scrollbar-track
  {
    background: ${props => props.theme.lightGrey};
  }
  ::-webkit-scrollbar
  {
    width: 2px;
  }
  ::-webkit-scrollbar-thumb
  {
    background: ${props => props.theme.tocAccent};
  }
  @media screen and (max-width: 600px) {
    order: 3;
    overflow: inherit;
  }
`

/* eslint no-undef: "off" */
export const pageQuery = graphql`
  query OverviewBySlug($slug: String!) {
    allPostTitles: allMarkdownRemark(
      filter: { frontmatter: { index: { ne: null } } }
    ){
      edges {
        node {
          frontmatter {
            title
            index
            type
          }
          fields {
            slug
          }
        }
      }
    }
    navTypes: allMarkdownRemark (
      filter: { frontmatter: { category: { ne: null } } }
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
            type
            index
          }
        }
      }
    }
    postBySlug: markdownRemark(fields: { slug: { eq: $slug } }) {
      htmlAst
      timeToRead
      excerpt
      headings  {
        value
        depth
      }
      frontmatter {
        title
        category
        type
        source
        index
      }
      fields {
        slug
      }
    }
    postByCategory:  allMarkdownRemark(
      filter: { frontmatter: { category: { ne: null }, index: { ne: null } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          headings {
            value
            depth
          }
          excerpt
          timeToRead
          frontmatter {
            title
            category
            index
            type
            source
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
              announcementType
            }
          }
        }
      }
  }
`;

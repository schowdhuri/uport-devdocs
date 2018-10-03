import React from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'
import _ from 'lodash'
import { cleanDoubleByteChars } from '../../helpers/cleanDoubleByteChars'

export default class TableOfContents extends React.Component {
  render () {
    let urlHash = ''
    let pathName = ''
    if (typeof window !== 'undefined') {
      urlHash = window.location.hash.replace('#', '')
      pathName = window.location.pathname
    }
    
    const {types} = this.props
    const {post} = this.props
    const type = post.type

    /* const type = this.props.contentsType */
    const postNodes = [];
  
    types.forEach(_post => {
        const postNode = {
          title: _post.node.frontmatter.title,
          path: _post.node.fields.slug,
          indexNumber: _post.node.frontmatter.index,
          category: _post.node.frontmatter.category,
          headings: _post.node.headings
        }
        
        if (postNode.indexNumber || postNode.indexNumber === 0) {
          postNodes.push(postNode)
        } else if (post.title == _post.node.frontmatter.title ) {
          postNodes.push(
            {
              title: _post.node.frontmatter.title,
              path: _post.node.fields.slug,
              indexNumber: 0,
              category: _post.node.frontmatter.category,
              headings: _post.node.headings
            } 
          )
        }
    })

    const listItems = []
    postNodes.sort((a, b) => a.indexNumber - b.indexNumber).forEach((cat) => {
      const chapterContents = []
      if (cat.headings) {
        cat.headings.forEach(node => {
          if (node.depth === 2) {
            chapterContents.push(
              <ContentContainer key={`${node.value}`}>
                <Link to={`${cat.path}#${cleanDoubleByteChars(_.kebabCase(node.value))}`}>
                  <li>
                    <span>
                      {cleanDoubleByteChars(_.kebabCase(node.value)) === urlHash
                        ? <h6 className='active'>{node.value}</h6>
                        : <h6>{node.value}</h6>
                      }
                    </span>
                  </li>
                </Link>
              </ContentContainer>
            )
          }
        })
      }
      listItems.push(
        <li key={`${cat.path}`}>
          <Link to={`${cat.path}`}>
            <span>
              {<h5 className={`tocHeading ${(pathName === cat.path) ? 'active' : ''}`}>{cat.title.charAt(0).toUpperCase() + cat.title.slice(1)}</h5>}
            </span>
          </Link>
          <ul className='chapterItems'>
            {chapterContents}
          </ul>
        </li>
      )
    })
    return (
      <TableOfContentsContainer id="toc">
        <ul>
          {listItems}
        </ul>
      </TableOfContentsContainer>
    )
  }
}

const TableOfContentsContainer = styled.div`
  padding: ${props => props.theme.sitePadding};


  ul li::before {
    all: initial;
    background-image: none;
    list-style: none;
   }
 
 & > ul, .chapterItems {
   list-style: none;
   padding: 0;
   margin-left: 30px;
 }

 a {
   text-decoration: none;
 }

 p, h6 {
   display: inline-block;
   font-weight: 400;
   font-size: 14px;
   margin-bottom: 8px;
 }

 h5.active {
   color: ${props => props.theme.brandHighlight};
 }

 h5:hover {
   color: ${props => props.theme.brandHighlight};
 }

 h6.active {
   color: ${props => props.theme.secondaryBrand};
 }

 .tocHeading {
   font-weight: 400;
   color: ${props => props.theme.darkGrey};
   margin-top: 25px;
   font-size: 16px;
 }
`

const ContentContainer = styled.div`
   h6, p {
   color: ${props => props.theme.darkGrey};
 }
 li {
   margin-left:-10px;
 }

 &:hover {
   li {
     span {
       border-bottom: 1px solid ${props => props.theme.tocAccent};
     }
   }
 }
`

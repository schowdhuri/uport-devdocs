import React from "react"
import Link from 'gatsby-link'
import styled from 'styled-components'
import _ from "lodash";

export default class TableOfContents extends React.Component {
  render() {
    const {category} = this.props
    const {categories} = this.props
    const type = this.props.contentsType
    const postNodes = []
    categories.forEach(post => {
      if (((post.node.frontmatter.category === category) && (post.node.frontmatter.type === type))) {
        const postNode = {
          title: post.node.frontmatter.title,
          path: post.node.fields.slug,
          lessonNumber: post.node.frontmatter.lesson,
          category: post.node.frontmatter.category,
          headings: post.node.headings
        }
        postNodes.push(postNode)
      }
    })
    const listItems = []
    postNodes.sort((a,b) => a.lessonNumber - b.lessonNumber).forEach((cat) => {
      const chapterLessons = []
      if(cat.headings){
        cat.headings.forEach(node => {
          if (node.depth === 2){
            chapterLessons.push(
              <LessonContainer>
                <Link to={`${cat.path}#${_.kebabCase(node.value)}`}>
                  <li>
                    <span>
                      <h6>{node.value}</h6>
                    </span>
                  </li>
                </Link>
              </LessonContainer>
            )
          }
        })
      }
      listItems.push(
        <li className='chapter'>
          <Link to={`${cat.path}`}>
            <h5 className='tocHeading'>
              {cat.title.toUpperCase()}
            </h5>
          </Link>
          <ul className='chapterItems'>
            {chapterLessons}
          </ul>
        </li>
      )
    })
    return (
      <TableOfContentsContainer>
        <ul>
          {listItems}
        </ul>
      </TableOfContentsContainer>
    )
    }
}

const TableOfContentsContainer = styled.div`
  padding: ${props => props.theme.sitePadding};

  & > ul, .chapterItems {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  p, h6 {
    display: inline-block;
    font-weight: 200;
    margin: 0;
  }

  .tocHeading {
     font-weight: 200;
     color: ${props => props.theme.brand};
     margin-bottom: 10px;
  }
`

const LessonContainer = styled.div`
  h6, p {
    color: black;
    margin: 0;
    line-height: 1.5;
  }
  li {
    margin: 0;
  }
  &:hover {
    li {
      span {
        border-bottom: 1px solid black;
      }
    }
  }
`
import React, { Component } from 'react'
import Link from 'gatsby-link'
import styled from 'styled-components'

class ctaButton extends Component {
  render() {
    const { children } = this.props
    return(
      <a style={{border: 'none'}} href={this.props.to} target='_blank'>
        <ButtonContainer>
          {children}
        </ButtonContainer>
      </a>
    )
  }
}

export default ctaButton

const ButtonContainer = styled.div`
  float: right;
  margin-right: 320px;
  margin-top: 22px;
  border: 1px solid ${props => props.theme.brand};
  border-radius: 3px;
  padding: 2px 6px 2px 6px;
  font-size: 1rem;
  color: ${props => props.theme.brand};
  display: inline-block;
  transition: all .1s ease;

  &:hover {
  color: white;
  background: ${props => props.theme.brand};
  }

  @media screen and (max-width: 600px) {
    margin-top: 0px;
    margin-bottom: 10px;
    float: left;
    margin-left: 52px;
  }
`

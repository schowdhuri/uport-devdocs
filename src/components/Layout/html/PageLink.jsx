import React from 'react'
import styled from 'styled-components'

export default props => (<div>
  <Link to={props.url}>
    <Prefix>{props.prefix}</Prefix>
    <Title>{props.title}</Title>
  </Link>
</div>)

const Prefix = styled.span`
  display: inline-block;
  font-size: 0.9em;
  margin-right: 5px;
  text-transform: uppercase;
`

const Title = styled.span`
  display: inline-block;
  font-size: 1.1em;
  font-weight: 800;
`

const Link = styled.a`
  background: #5c50ca;
  border: 2px solid #5c50ca;
  border-radius: 4px;
  color: #fff;
  display: block;
  font-weight: 400;
  margin: 20px auto 40px;
  max-width: 95ch;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  width: 100%
`

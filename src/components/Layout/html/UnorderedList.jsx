import styled from 'styled-components'
import tick from '../../../images/blue-tick.svg'

export default styled.ul`
  list-style: none;
  margin: 0 0 10px 0;
  padding: 0 0 0 40px;
  text-indent: -25px;

  li {
    margin-top: 0.4em;
  }
  li::before {
    content: "";
    color: #62b482;
    display: inline-block;
    width: 1em;
    height: 1em;
    margin-right: 10px;
    vertical-align: middle;
    text-align: center;
    direction: rtl;
    background-image: url(${tick});
    background-size: contain;
    background-repeat: no-repeat;
  }
`

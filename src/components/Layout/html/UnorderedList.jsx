import styled from 'styled-components'
import tick from '../../../images/blue-tick.svg'

export default styled.ul`
  list-style: none;
  margin: 0 0 10px 0;
  padding: 0;

  li {
    display: grid;
    grid-template-columns: 35px 1fr;
    margin: 0 0 20px;
  }
  li::before {
    background-image: url(${tick});
    background-position: 0 2px;
    background-repeat: no-repeat;
    background-size: contain;
    content: "";
    color: #62b482;
    height: 20px;
    position: static;
    text-align: center;
    vertical-align: middle;
    width: 20px;
  }
`

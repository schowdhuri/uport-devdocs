import React, {Component} from 'react'
import styled from 'styled-components'
import blueTick from '../../images/blue-grey-tick.png'

class ServerValueProp extends Component {

  render() {
    return (
      <Container>
        <div className='grid'>
          <div className='left'>
            <h2>
              Create & Request Attested Data
            </h2>
            <p>Just like you can ask a user for verified data about themselves, you can also help a user build their identity by verifying their data.</p>
          </div>
          <div className='right'>
            <div className='border'>
              <ul>
                <li>Create and verify authentication requests</li>
                <li>Request verified claims</li>
                <li>Verify claims for your users</li>
                <li>Ask users to sign Ethereum transactions</li>
                <li>Sign transactions</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default ServerValueProp

const Container = styled.section`
background-color: #fff;
padding-top: 150px;
padding-bottom: 150px;
.grid {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto;
  grid-gap: 122px;
  justify-content: center;
}
.left {}
.right {}
.border {
  height: 434px;
  width: 386px;
  box-shadow: 0px 0px 10px
  rgba(139, 139, 139, 0.25);
  border-radius: 8px;
  margin: auto;
}
h2 {
  font-size: 30px;
  font-weight: 800;
  font-style: normal;
  line-height: 42px;
  max-width: 692px;
  margin: unset;
  margin: initial;
}
ul {
  padding: unset;
  padding: initial;
  padding-top: 1px;
  font-size: 18px;
  line-height: 29px;
  list-style: none;
}
li {
  width: 268px;
  word-wrap: break-word;
  margin: 35px 30px;
}
li::before {
  content: unset;
  content: initial;
  content: url(${blueTick});
}
p {
  font-size: 18px;
  line-height: 24px;
  font-weight: normal;
  font-style: normal;
  padding-top: 20px;
  max-width: 692px;
}
`

import React, {Component} from 'react'
import styled from 'styled-components'
import blueTick from '../../images/orange-tick.svg'

class ServerValueProp extends Component {
  render() {
    return (
      <Container>
        <div className='grid'>
          <div className='left'>
            <h2>
              Become a Trusted Issuer of Verifications
            </h2>
            <p>
              Using Uport Connect you can quickly begin to request and issue
              verified data about your users.  Each time a user verifies data they are
              also building their digital identity by recording their interaction with applications
              built by developers like yourselves.
            </p>
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
  justify-content: center;
}
.left {
  padding: 20px;
}
.right {
  margin: 0 auto;
  padding: 20px;
}
.border {
  box-shadow: 0px 0px 10px
  rgba(139, 139, 139, 0.25);
  border-radius: 8px;
  padding: 20px;
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
  margin: 0;
}
li {
  word-wrap: break-word;
  &:first-child {
    margin-top: 0;
  }
  &:last-child {
    margin-bottom: 0;
  }
  margin: 40px 10px 40px 35px;
  text-indent: -30px;
}
li::before {
  content: unset;
  content: initial;
  content: url(${blueTick});
  left: 10px;
}
p {
  font-size: 24px;
  line-height: 1.5;
  font-weight: normal;
  font-style: normal;
  padding-top: 20px;
  max-width: 692px;
}
@media screen and (min-width: 768px) {
  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 122px;
  }
  .left {
    padding: 0 0 0 10vw;
  }
  .right {
    margin: 0;
    padding: 0;
  }
  .border {
    margin: 0 20px 0 0;
    max-width: 386px;
    padding: 40px;
  }
}
`

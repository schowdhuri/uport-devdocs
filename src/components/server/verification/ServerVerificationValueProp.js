import React, {Component} from 'react'
import styled from 'styled-components'
import blueTick from '../../../images/blue-grey-tick.png'

class ServerVerificationValueProp extends Component {

  render() {
    return (
      <Container>
        <div className='grid'>
          <div className='left'>
            <h2>
              Issue Server-Side Verifications
            </h2>
            <p>
              By presenting a verification to a user, you are cryptographically signing a claim about that user, and as a result, attesting to the truth of a peice of information about them.
            </p>
            <p>
              Attesting to information about your users will enable them to build up their digital identity and add real value to your dApp.
            </p>
          </div>
          <div className='right'>
            <div className='border'>
              <ul>
                <li>Cryptographically sign user data on behalf of your application</li>
                <li>Send verifications as a JWT to your users via a QR, push, or another transport</li>
                <li>Help Users in Building a Digital Identity</li>
              </ul>
            </div>
          </div>
        </div>a
      </Container>
    );
  }
}

export default ServerVerificationValueProp

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
.left {
  p {
    font-size: 18px;
    line-height: 24px;
    font-weight: normal;
    font-style: normal;
    padding-top: 20px;
    max-width: 692px;
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
}
.right {}
.border {
  height: 434px;
  width: 386px;
  box-shadow: 0px 0px 10px
  rgba(139, 139, 139, 0.25);
  border-radius: 8px;
  margin: auto;
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

`

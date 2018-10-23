import React, {Component} from 'react'
import styled from 'styled-components'
import blueTick from '../../../images/blue-grey-tick.png'

class ServerLoginValueProp extends Component {

  render() {
    return (
      <Container>
        <div className='grid'>
          <div className='left'>
            <h2>
              Login.  Simplified. 
            </h2>
            <p>
              uPort can be used to provide a simple solution for your users to log in to your app and share private credentials, such as identity information and contact details using uPort Credentials.
              {/* <ul> */}
              {/*   <li>Create an empty node project</li> */}
              {/*   <li>Install uPort Credentials</li> */}
              {/*   <li>Download and install the uPort Mobile app for iOS or Android</li> */}
              {/* </ul> */}
            </p>
          </div>
          <div className='right'>
            <div className='border'>
              <ul>
                <li>Login a user</li>
                <li>Create disclosure requests</li>
                <li>Sign and consume secure JWTs</li>
                <li>Authenticate disclosure responses</li>
              </ul>
            </div>
          </div>
        </div>a
      </Container>
    );
  }
}

export default ServerLoginValueProp

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

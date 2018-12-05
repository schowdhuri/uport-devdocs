import React, {Component} from 'react'
import styled from 'styled-components'
import blueTick from '../../../images/blue-tick.svg'
import UnorderedList from '../../Layout/html/UnorderedList'
import { Container, Grid, Col, medium } from '../../../layouts/grid'

class ServerLoginValueProp extends Component {
  render() {
    return (
      <Wrapper>
        <Container>
          <Grid>
            <Col span={7} className='left'>
              <Grid>
                <Col span={12}>
                  <h2>
                    Login.  Simplified.
                  </h2>
                </Col>
                <Col span={12}>
                  <p>
                    uPort can be used to provide a simple solution for your
                    users to log in to your app and share private credentials,
                    such as identity information and contact details using
                    uPort Credentials.
                    {/* <ul> */}
                    {/*   <li>Create an empty node project</li> */}
                    {/*   <li>Install uPort Credentials</li> */}
                    {/*   <li>Download and install the uPort Mobile app for iOS or Android</li> */}
                    {/* </ul> */}
                  </p>
                </Col>
              </Grid>
            </Col>
            <Col span={5} className='right'>
              <div className='border'>
                <UnorderedList>
                  <li>Login a user</li>
                  <li>Create disclosure requests</li>
                  <li>Sign and consume secure JWTs</li>
                  <li>Authenticate disclosure responses</li>
                </UnorderedList>
              </div>
            </Col>
          </Grid>
        </Container>
      </Wrapper>
    );
  }
}

export default ServerLoginValueProp

const Wrapper = styled.section`
  background-color: #fff;
  padding-top: 150px;
  padding-bottom: 150px;
  .border {
    box-shadow: 0px 0px 10px
    rgba(139, 139, 139, 0.25);
    border-radius: 8px;
  }
  .left {
    p {
      font-size: 18px;
      line-height: 24px;
      font-weight: normal;
      font-style: normal;
    }
    h2 {
      font-size: 30px;
      font-weight: 800;
      font-style: normal;
      line-height: 42px;
      margin: unset;
      margin: initial;
    }
  }
  .border {
    padding: 20px;
    ${medium('padding: 40px;')}
  }
`

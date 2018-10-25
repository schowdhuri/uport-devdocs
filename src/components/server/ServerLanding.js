import React, {Component} from 'react'
import styled from 'styled-components'
import serverImg from '../../images/server-landing.png'
import arrowImg from '../../images/ArrowBlack.png'
import blueTick from '../../images/blue-grey-tick.png'

class ServerLanding extends Component {

  render() {
    return (
      <Container>
          <div className='grid'>
            <div className='left'>
              &nbsp;
            </div>
            <div className='right'>
              <div className='right-wrap'>
                <h2>Server</h2>
                <p>
                  Server applications can integrate with uPort easily using uport-credentials and other helpful tools for traditional and web3 solutions.
                </p>
                <hr />
                <div className='subgrid'>
                  <div className='subleft'>
                    <ul>
                      <li className='blue-tick'>Create and verify authentication requests</li>
                      <li className='blue-tick'>Ask users to sign Ethereum transactions</li>
                    </ul>
                  </div>
                  <div className='subright'>
                    <ul>
                      <li className='blue-tick'>Request verified claims</li>
                      <li className='blue-tick'>Verify claims for your users</li>
                    </ul>
                  </div>
                  <a href='/server' className='link'>
                    VIEW ALL SOLUTIONS
                  </a>
                </div>
              </div>
            </div>
          </div>
      </Container>
    );
  }
}

export default ServerLanding

const Container = styled.section`
.grid {
  overflow: hidden;
  width: 1137px;
  height: 491px;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto;
  justify-content: space-between;
  margin: auto;
  border-radius: 4px;
  box-shadow: 0px 0px 20px rgba(139, 139, 139, 0.25);
  background: #FFFFFF;
}
.left {
  width: 568.5px;
  background-image: url(${serverImg});
  background-position: left bottom;
  background-repeat: no-repeat;
  
}
.right {
  width: 568.5px;
}
.right-wrap {
  margin: 76px 80px 0 0;
  height: 339px;
  width: 430px;
}
.subgrid {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto;
  grid-gap: 40px
  justify-content: center;  
  height: 189px;
}
.subleft {
  
}
.subright {
  
}
.border {
  height: 434px;
  width: 386px;
  box-shadow: 0px 0px 10px
  rgba(139, 139, 139, 0.25);
  border-radius: 8px;
  margin: auto;
}
hr {
  margin: unset;
  margin: initial;
  border: 1px solid #E5E5E5;
}
h2 {
  font-size: 24px;
  font-weight: 800;
  font-style: normal;
  line-height: 32px;
  color: #3F3D4B;
}
ul {
  padding: unset;
  padding: initial;
  font-size: 18px;
  font-style: normal;
  font-weight: bold;
  line-height: 24px;
  margin-top: 36.93px;
  list-style: none;
}
li {
  color: #4C9EA6;
  word-wrap: break-word;
  margin-bottom: 20px;
}
li::before {
  content: unset;
  content: initial;
  content: url(${blueTick});
}
p {
  height: 81px;
  font-size: 16px;
  line-height: 24px;
  font-weight: normal;
  font-style: normal;
  color: #3F3D4B;
}
a {
  text-decoration: none;
}
.link {
 font-style: normal;
 font-weight: 800;
 font-size: 14px;
 line-height: 18px;
 color: #3F3D4B;
}
.link::after {
  content: url(${arrowImg});
  margin-left: 20px;
  vertical-align: middle;
  text-align: center;
  background-size: contain;
  background-repeat: no-repeat;
}
`

import React, {Component} from 'react'
import styled from 'styled-components'
import web3Img from '../../images/web3monitor.png'
import arrowImg from '../../images/ArrowBlack.png'
import orangeTick from '../../images/orange-tick.svg'

class WebThreeLanding extends Component {

  render() {
    return (
      <Container>
          <div className='grid'>
            <div className='left'>
              &nbsp;
            </div>
            <div className='right'>
              <div className='right-wrap'>
                <h2>Web 3.0</h2>
                <p>
                  uPort provides client-side libraries that allow you to interact with a user's uPort identity&mdash;through the mobile app. You can create requests for a user's data, share credentials, and generate transactions to be signed on the user's mobile app.
                </p>
                <hr />
                <div className='subgrid'>
                  <div className='subleft'>
                    <ul>
                      <li className='blue-tick'>
                        <a href='/connect/login'>Create and verify authentication requests</a>
                      </li>
                      {/* <li className='blue-tick'> */}
                      {/*   <a href='#'>Ask users to sign Ethereum transactions</a> */}
                      {/* </li> */}
                    </ul>
                  </div>
                  <div className='subright'>
                    <ul>
                      <li className='blue-tick'>
                        <a href='/connect/sendverification'>Create and Send verified claims</a>
                      </li>
                      <li className='blue-tick'>
                        <a href='/connect/requestverification'>Request verified claims from your users</a>
                      </li>
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

export default WebThreeLanding

const Container = styled.section`
.grid {
  overflow: hidden;
  justify-content: space-between;
  margin: auto;
  box-shadow: 0px 0px 20px rgba(139, 139, 139, 0.25);
  background: #FFFFFF;
}
.left {
  display: none;
}
.right {

}
.right-wrap {
  margin: 2em;
}
.subgrid {
  justify-content: center;
  margin: 40px 0;
}
.subleft {

}
.subright {

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
  list-style: none;
  text-indent: -25px;
}
li {
  color: #E77E55;
  word-wrap: break-word;
  margin: 0 0 20px 40px;
}
li::before {
  content: unset;
  content: initial;
  content: url(${orangeTick});
  left: 5px;
  margin-right: 10px;
}
p {
  font-size: 16px;
  line-height: 24px;
  font-weight: normal;
  font-style: normal;
  color: #3F3D4B;
}
a {
  color: #E77E55;
  text-decoration: none;
}
.link {
 font-style: normal;
 font-weight: 800;
 font-size: 14px;
 line-height: 18px;
 color: #3F3D4B;
 grid-area: 2 / 1 / 3 / 3;
}
.link::after {
  content: url(${arrowImg});
  margin-left: 20px;
  vertical-align: middle;
  text-align: center;
  background-size: contain;
  background-repeat: no-repeat;
}
@media (min-width: 768px) {
  .grid {
    border-radius: 4px;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    max-width: 1137px;
  }
  .left {
    display: block;
    background-image: url(${web3Img});
    background-position: right bottom;
    background-repeat: no-repeat;
  }
  .right-wrap {
    margin: 76px 80px 0 0;
  }
  .subgrid {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: auto;
    grid-gap: 40px
    margin-top: 0;
  }
  ul {
    margin-top: 40px;
  }
}
@media (max-width: 1137px) {
  .grid {
    margin: 0 2rem;
  }
}
@media (min-width: 1137px) {
  .left {
    background-position: left bottom;
  }
}
`

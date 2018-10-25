import React, {Component} from 'react'
import styled from 'styled-components'
import blob from '../../images/Blob.svg'

class ServerSolutions extends Component {
  render () {
    return (
      <Container>
        <div className={'grid'}>
          <div>
            <a id='server-solutions'>
              <h2>Solutions for Server Applications</h2>
            </a>
          </div>
          <div>
            &nbsp;
          </div>
          <a href='/server/login'>
            <div className='left block-item'>
              <img className='blob' src={blob} />
              <div className='block-content'>
                <h4>Login</h4>
                <p>uPort provides a simple solution for your users to log in to your app and share private credentials, such as identity information and contact details.</p>
                <h3>LEARN MORE</h3>
              </div>
            </div>
          </a>
          {/* <div className='right block-item'> */}
          {/*   {/\* <img className='blob' src={blob} /> *\/} */}
          {/*   {/\* <div className='block-content'> *\/} */}
          {/*   {/\*   <h4>Verify Credentials</h4> *\/} */}
          {/*   {/\*   <p>verify verify verify verify verify verify verify verify verify verify verify</p> *\/} */}
          {/*   {/\* </div> *\/} */}
          {/* </div> */}
        </div>
      </Container>
    )
  }
}

export default ServerSolutions

const Container = styled.section`
margin-top: 143px;
.grid {
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto;
  grid-gap: 30px 30px;
  justify-content: center;
  margin-bottom: 150px;
}
.left {
  // background: pink;
}
.right {
  // background: grey;
}
.blob {
  position: absolute;
  padding: 40px 0 0 40px;
}
h2 {
  font-size: 32px;
  font-weight: bold;
  line-height: 40px;
}
h3 {
  color: #4C9EA6;
  text-align: right;
  margin: 61px 40px 0px 0;
}
h4 {
  font-size: 24px;
  line-height: 32px;
  a {
    text-decoration: none;
  }
}
h4, p {
  color: #3E3C49;
}
p {
  max-width: 93%;
}
.block-item {
  position: relative;
  width: 590px;
  height: 349px;
  box-shadow: 0px 0px 10px
  rgba(139, 139, 139, 0.25);
  border-radius: 8px;
}
.block-content  {
  position: absolute;
  z-index: 10;
  top: 65px;
  left: 60px;
}
a {
  color: inherit;
  text-decoration: none;
}
.nudge-right {
  padding-left: 13px;
}

@media screen and (max-width: 600px) {
  .code-block, .block-item {
    width: 90%;
    height: 100%;
  }
  .block-item {
    padding: 5px;
    margin-left: 25px;
    p {
      max-width: 100%;
    }
  }
  .wrapper {
    max-width: 80vw;
  }
}
`

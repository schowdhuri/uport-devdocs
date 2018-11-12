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
  margin-top: 150px;
  margin-bottom: -150px;
  .grid {
    justify-content: center;
    margin: 0 20px;
  }
  .blob {
    display: none;
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
    background-color: #fff;
    position: relative;
    box-shadow: 0px 0px 10px
    rgba(139, 139, 139, 0.25);
    border-radius: 8px;
  }
  .block-content  {
    padding: 20px;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  .nudge-right {
    padding-left: 13px;
  }

  @media screen and (min-width: 768px) {
    .grid {
      display: grid;
      grid-template-columns: auto auto;
      grid-gap: 30px 30px;
      margin: 0 20px;
    }
    .block-item {
      width: 590px;
    }
    .block-item {
      height: 349px;
    }
    .blob {
      display: block;
      position: absolute;
      padding: 40px 0 0 40px;
    }
    .block-content  {
      left: 60px;
      padding: 0;
      position: absolute;
      top: 65px;
      z-index: 10;
    }
  }
`

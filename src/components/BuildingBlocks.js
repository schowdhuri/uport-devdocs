import React, {Component} from 'react'
import styled from 'styled-components'

const Container = styled.section`
    background-color: #fff;
    .building-blocks-wrapper {
      margin: 0 auto;
    }
    h2 {
      font-size: 32px;
      font-weight: bold;
      line-height: 40px;
    }
    h3, h4 {
      padding: 20px;
      color: #8986A0;
      font-size: 24px;
      line-height: 32px;
    }
    h4 {
      color: #5C50CA;
      padding: 20px;
      margin: 0;
    }
    p {
      max-width: 90%;
      padding: 0px 20px 20px 20px
      margin: 0;
    }
    .code-block {
      display: table;
      border-radius: 4px;
      background-color: #f9f9fa;
      margin: 0px 20px 21px 20px;
      width: 390px;
      height: 50px;
      font-family: Consolas, Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace;
      color: #3db77d;
      white-space: nowrap;
      span {
        display: table-cell;
        vertical-align: middle;
        padding: 13px 0px 18px 20px;
      }
    }
    .block-item {
      width: 430px;
      height: 220px;
      box-shadow: 0px 0px 4px
      rgba(0,0,0, 0.25);
      border-radius: 4px;
      margin-bottom: 30px;
      margin-left: 30px;
    }
    a {
        color: inherit;
        text-decoration: none;
    }
    .nudge-right {
      padding-left: 28px;
    }
`

class BuildingBlocks extends Component {
  render () {
    return (
      <Container className='building-blocks'>
        <a id='platform'/>
        <div className='building-blocks-wrapper'>
          <h2>Identity Building Blocks</h2>
          <div className={'Grid Grid--gutters'}>
            <div>
              <h3 className='nudge-right'>Libraries</h3>
              <div>
                <a href='/categories/uport-connect'>
                  <div className='block-item'>
                    <h4>uPort Connect    &#x2192;</h4>
                    <p>Single sign-on and transaction signing for your client-side app</p>
                    <div className={'code-block'}>
                      <span>npm -i uport-connect</span>
                    </div>
                  </div>
                </a>
                <a href='/categories/uport-credentials'>
                  <div className='block-item'>
                    <h4>uPort Credentials     &#x2192;</h4>
                    <p>Request, sign, and issue credentials from your app server</p>
                    <div className={'code-block'}>
                      <span>npm -i uport-credentials</span>
                    </div>
                  </div>
                </a>
               <a href='/categories/uport-transports'>
                  <div className='block-item'>
                    <h4>uPort Transports    &#x2192;</h4>
                    <p>Set up communication channels between your app and uPort clients.</p>
                    <div className={'code-block'}>
                      <span>npm -i uport-transports</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
            <div>
              <h3 className='nudge-right'>Tools</h3>
              <div>
                <a href='/categories/ethr-did'>
                  <div className='block-item'>
                    <h4>EthrDID    &#x2192;</h4>
                    <p>Create Decentralized Identifiers and manage their interactions in your app.</p>
                    <div className={'code-block'}>
                      <span>npm -i ethr-did</span>
                    </div>
                  </div>
                </a>
                <a href='/categories/ethr-did-registry'>
                  <div className='block-item'>
                    <h4>EthrDID Registry    &#x2192;</h4>
                    <p>Smart contract for the resolution and management of decentralized identifiers (DIDs)</p>
                    <div className={'code-block'}>
                      <span>npm -i ethr-did-registry</span>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </Container>
    )
  }
}

export default BuildingBlocks

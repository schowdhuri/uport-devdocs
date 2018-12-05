import React, {Component} from 'react'
import styled from 'styled-components'
import { Container, Grid, Col, medium } from '../layouts/grid'
import track from '../utilities/track'

class BuildingBlocks extends Component {
  track = (name) => () => {
    track(name, {
      source: 'home'
    })
  }
  render () {
    return (
      <Wrapper className='building-blocks'>
        <Container>
          <a id='platform'/>
          <Grid>
            <Col span={12}>
              <h2>Identity Building Blocks</h2>
            </Col>
            <Col span={6} medium>
              <Grid>
                <Col span={12}>
                  <h3>Libraries</h3>
                </Col>
                <Col span={12}>
                  <a className='block-item' href='/categories/uport-connect' onClick={this.track('uPort Connect Clicked')}>
                    <h4 className='arrow'>uPort Connect</h4>
                    <p>Single sign-on and transaction signing for your client-side app</p>
                    <div className={'code-block'}>
                      <span>npm -i uport-connect</span>
                    </div>
                  </a>
                </Col>
                <Col span={12}>
                  <a className='block-item' href='/categories/uport-credentials' onClick={this.track('uPort Credentials Clicked')}>
                    <h4 className='arrow'>uPort Credentials</h4>
                    <p>Request, sign, and issue credentials from your app server</p>
                    <div className={'code-block'}>
                      <span>npm -i uport-credentials</span>
                    </div>
                  </a>
                </Col>
                <Col span={12}>
                  <a className='block-item' href='/categories/uport-transports' onClick={this.track('uPort Transports Clicked')}>
                    <h4 className='arrow'>uPort Transports</h4>
                    <p>Set up communication channels between your app and uPort clients.</p>
                    <div className={'code-block'}>
                      <span>npm -i uport-transports</span>
                    </div>
                  </a>
                </Col>
              </Grid>
            </Col>
            <Col span={6} medium>
              <Grid>
                <Col span={12}>
                  <h3>Tools</h3>
                </Col>
                <Col span={12}>
                  <a className='block-item' href='/categories/ethr-did' onClick={this.track('EthrDID Clicked')}>
                    <h4 className='arrow'>EthrDID</h4>
                    <p>Create Decentralized Identifiers and manage their interactions in your app.</p>
                    <div className={'code-block'}>
                      <span>npm -i ethr-did</span>
                    </div>
                  </a>
                </Col>
                <Col span={12}>
                  <a className='block-item' href='/categories/ethr-did-registry' onClick={this.track('EthrDID Registry Clicked')}>
                    <h4 className='arrow'>EthrDID Registry</h4>
                    <p>Smart contract for the resolution and management of decentralized identifiers (DIDs)</p>
                    <div className={'code-block'}>
                      <span>npm -i ethr-did-registry</span>
                    </div>
                  </a>
                </Col>
              </Grid>
            </Col>
          </Grid>
        </Container>
      </Wrapper>
    )
  }
}

const Wrapper = styled.section`
  background-color: #fff;
  padding: 250px 0 50px;

  h2 {
    font-size: 32px;
    font-weight: bold;
    line-height: 40px;
    margin: 0;
    text-align: left;
  }
  h3 {
    color: #8986A0;
    font-size: 24px;
    line-height: 32px;
    margin: 0;
    padding: 0;
  }
  h4 {
    color: #5C50CA;
    font-size: 24px;
    line-height: 32px;
    margin: 0;
    padding: 0 0 20px;
  }
  p {
    padding: 0;
    margin: 0;
  }
  .code-block {
    border-radius: 4px;
    background-color: #f9f9fa;
    margin-top: 20px;
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
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.25) 0px 0px 4px;
    color: inherit;
    display: block;
    padding: 20px;
    position: relative;
    text-decoration: none;
  }
  ${medium(`
    .code-block {
      bottom: 20px;
      left: 20px;
      margin-top: 0;
      position: absolute;
      right: 20px;
    }
    .block-item {
      min-height: 250px;
    }
  `)}
`

export default BuildingBlocks

import React, {Component} from 'react'
import styled from 'styled-components'
import track from '../../utilities/track'

class ServerResources extends Component {
  track = (name) => () => {
    track(name, {
      source: 'Server Landing'
    })
  }
  render () {
    return (
      <Container>
        <div className='grid'>
          <div className='header-row'>
            <h2>Additional Resources</h2>
            <h3>Libraries</h3>
          </div>
          <div className='block-item'>
            <a href='/categories/uport-transports' onClick={this.track('uPort Transports Clicked')}>
              <h4>Transports    &#x2192;</h4>
              <p>Setup communication channels between your app and uPort clients.</p>
            </a>
            <div className={'code-block'}>
              <span>npm -i uport-transports</span>
            </div>
          </div>
          <div className='block-item'>
            <a href='/categories/ethr-did' onClick={this.track('EthrDID Clicked')}>
              <h4>EthrDID    &#x2192;</h4>
              <p>Create Decentralized Identifiers and manage their interactions in your app.</p>
            </a>
            <div className={'code-block'}>
              <span>npm -i ethr-did</span>
            </div>
          </div>
          <div className='block-item'>
            <a href='/categories/ethr-did-registry' onClick={this.track('EthrDID Registry Clicked')}>
              <h4>Ethr DID Registry    &#x2192;</h4>
              <p>Smart contract to resolve and manage decentralized identifiers (DIDs)</p>
            </a>
            <div className={'code-block'}>
              <span>npm -i ethr-did-registry</span>
            </div>
          </div>
        </div>
      </Container>
    )
  }
}

export default ServerResources

const Container = styled.section`
  padding-top: 300px;
  margin-bottom: 154px;
  background-color: #fff;
  .grid {
    justify-content: center;
    margin: 0 20px;
  }
  h2 {
    font-size: 32px;
    font-weight: bold;
    line-height: 40px;
  }
  h2, h3 {
    padding: 0;
  }
  h3, h4 {
    color: #8986A0;
    font-size: 24px;
    line-height: 18px;
  }
  h4 {
    color: #4C9EA6;
    padding: 20px 0 0 20px;
    margin: 0;
  }
  p {
    font-size: 16px:
    line-height: 22px;
    margin-bottom: unset;
    margin-bottom: initial;
    padding: 11px 0 20px 20px;
    max-width: 90%;
  }
  .code-block {
    border-radius: 4px
    background-color: #f9f9fa;
    font-size: 16px;
    line-height: 19px;
    font-family: Menlo, Monaco, "Andale Mono WT", "Andale Mono", "Lucida Console", "Lucida Sans Typewriter", "DejaVu Sans Mono", "Bitstream Vera Sans Mono", "Liberation Mono", "Nimbus Mono L", "Courier New", Courier, monospace;
    color: #3db77d;
    position: absolute;
    bottom: 20px;
    left: 20px;
    right: 20px;
    span {
      display: table-cell;
      vertical-align: middle;
      padding: 13px 0px 18px 20px;
    }
  }
  .block-item {
    box-shadow: 0px 0px 4px rgba(0,0,0, 0.25);
    border-radius: 4px;
    margin-bottom: 30px;
    padding-bottom: 80px;
    position: relative;
  }
  a {
      color: inherit;
      text-decoration: none;
  }
  .header-row {
    margin-bottom: 30px;
  }
  @media screen and (min-width: 768px) {
    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: auto auto;
      grid-gap: 30px;
      max-width: 80em;
    }
    .header-row {
      grid-area: 1 / 1 / 2 / 4;
      margin: 0;
    }
  }
  @media screen and (min-width: 1200px) {
    .grid {
      margin: 0 auto;
      width: 80em;
    }
  }
`

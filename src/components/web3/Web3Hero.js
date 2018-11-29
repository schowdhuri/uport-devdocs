import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import heroImg from '../../images/web3hero.svg'
import track from '../../utilities/track'

class Web3Hero extends React.Component {
  track = (name) => () => {
    track(name, {
      source: 'Web3 Landing'
    })
  }
  render () {
    return (
      <Hero>
        <div className={`left`}>
          <div className='content'>
            <h4>Using uPort in</h4>
            <h1 className='hero-title'>Client-Side Solutions</h1>
            <p className='hero-subheading'>
              Whether it's a "dApp" or a more traditional application, your users will appreciate the gift of soveriengty.

              Let them have power over what information they choose to disclose.
            </p>
            <div className={'hero-features'}>
              <div className=''>
                <a href='#web3-solutions' onClick={this.track('Web3 Solutions Clicked')}>
                  <div className={`hero-button`}>
                    GET STARTED
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className={`right`}>
          &nbsp;
        </div>
      </Hero>
    );
  }
}

export default Web3Hero

const Hero = styled.div`
  .left {
    position: relative;
    .content {
      padding: 50px 20px;
    }
  }
  .right {
    background-image: url(${heroImg});
    background-position: top right;
    background-repeat: no-repeat;
    background-size: contain;
    display: none;
  }
  .hero-title {
    font-style: normal;
    font-weight: 800;
    line-height: 72px;
    font-size: 52px;
    margin: -5px 0 10px 0;
  }
  .hero-subheading {
    font-style: normal;
    font-weight: normal;
    line-height: 36px;
    font-size: 24px;
    margin: 20px 0;
  }
  .hero-title, .hero-subheading, h2, h4, p {
    color: #3F3D4B;
  }
  .hero-button {
    height: 60px;
    margin: 10px 0 0 0;
    background: #E77E55;
    border: none;
    color: #FFFFFF;
    font-style: normal;
    font-weight: 800;
    line-height: 48px;
    font-size: 16px;
    text-align: center;
    padding: 7px 0 7px 0;
  }

  @media screen and (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 122px;
    height: 90vh;
    .left .content {
      padding: 20vh 0 0 10vw;
    }
    .right {
      display: block;
    }
  }
`


// https://foundation.zurb.com/sites/docs/media-queries.html#default-media-queries

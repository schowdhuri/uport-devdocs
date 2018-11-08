import React from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import heroImg from '../../images/Image.svg'


class ServerHero extends React.Component {
  render () {
    return (
      <Hero>
        <div className={`left`}>
          <div className='content'>
            <h4>Using uPort in</h4>
            <h1 className='hero-title'>Server Solutions</h1>
            <p className='hero-subheading'>
              Login your users, in addition to issuing and accepting verified data.
            </p>
            <div className={'hero-features'}>
              <div className=''>
                <a href='/server#server-solutions'>
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

export default ServerHero

const Hero = styled.div`
  .left {
    position: relative;
    .content {
      padding: 50px 20px;
    }
  }
  .right {
    background-image: url(${heroImg});
    background-position: 0 -65px;
    background-repeat: no-repeat;
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
    background: #4C9EA6;
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
    grid-template-columns: 2fr 3fr;
    .left .content {
      padding: 120px 0 0 120px;
    }
    .right {
      display: block;
    }
  }
`


// https://foundation.zurb.com/sites/docs/media-queries.html#default-media-queries

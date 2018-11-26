import React from 'react'
import registerResolver from 'https-did-resolver'
import resolve from 'did-resolver'
import styled from 'styled-components'
import lightPatternBg from '../../../images/configuratorBg.svg'
import successImage from '../../../images/success-icon.svg'
import errorImage from '../../../images/error-icon-circle.svg'

class VerificationModal extends React.Component {
  constructor() {
    super()
    this.state = {
      stage: 0 // 0: unverified, 1: verifying, 2: success, -1: fail
    }
  }
  handleClose = () => {
    this.setState({ stage: 0 })
    this.props.onClose()
  }
  handleVerify = () => {
    const { appDetails, appIdentity } = this.props
    this.setState({ stage: 1 })
    const publicAddress = appIdentity.did.replace('did:ethr:', '')
    registerResolver()
    resolve('did:https:' + appDetails.appURL)
      .then(doc => {
        console.log(doc.publicKey[0].ethereumAddress + ' | ' + publicAddress)
        setTimeout(() => {
          this.setState({ stage: 2 })
        }, 500)
      })
      .catch(err => {
        console.log('Verification Failed. ', err)
        setTimeout(() => {
          this.setState({ stage: -1 })
        }, 500)
      })
  }
  render() {
    const { appDetails, children, show } = this.props
    const { stage } = this.state
    return (<Modal show={show}>
      <Backdrop />
      <Content verifying={stage==1}>
        {stage === 0
          ? <div>
              <Header>
                <ButtonClose onClick={this.handleClose}>&times;</ButtonClose>
                <h5>Get uPort verification badge</h5>
                <Info>
                  Make your user feel safe while using your app and verify your URL
                  domain {" "}
                  <strong>{appDetails.appURL}</strong>{" "}
                  in 2 easy steps:
                </Info>
              </Header>
              <Body>
                {children}
              </Body>
              <Footer>
                <VerifyButton onClick={this.handleVerify}>Verify</VerifyButton>
              </Footer>
            </div>
          : stage === 1 // In progress
            ? <Progress>
                <div className='message'>Verifying your URL domain</div>
              </Progress>
            : stage === 2 // Success
              ? <div>
                  <Header nobg={true}>
                    <ButtonClose onClick={this.handleClose}>&times;</ButtonClose>
                    <h5>Congratulations!</h5>
                  </Header>
                  <Body>
                    <ResultIcon src={successImage} />
                    <ResultMessage>
                      You're a happy holder of uPort Verification Badge.
                      From now on your users will use you app without having
                      to worry of being phished.
                    </ResultMessage>
                  </Body>
                  <Footer />
                </div>
              : <div>
                  <Header nobg={true}>
                    <ButtonClose onClick={this.handleClose}>&times;</ButtonClose>
                    <h5>Uh-oh, something went wrong.</h5>
                  </Header>
                  <Body>
                    <ResultIcon src={errorImage} />
                    <ResultMessage>
                      Please make sure you follow all of the instructions.
                      In case the problem repeats contact us.
                    </ResultMessage>
                  </Body>
                  <Footer>
                    <RetryButton onClick={this.handleVerify}>Try Again</RetryButton>
                  </Footer>
                </div>}
      </Content>
    </Modal>)
  }
}

const Modal = styled.div`
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  transition: opacity 0.5s, visibility 0.5s;
  z-index: 900;
  ${props => props.show
    ? `
      opacity: 1;
      visibility: visible;
    `
    : `
      opacity: 0;
      visibility: hidden;
    `}
`
const Backdrop = styled.div`
  background: rgba(249, 249, 250, 0.8);
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 910;
`
const Content = styled.div`
  background: #fff;
  box-shadow: 0 0 10px rgba(139, 139, 139, 0.25);
  left: 50%;
  position: relative;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  z-index: 920;
  ${props => props.verifying ? '' : 'width: 96vw;'}
  @media screen and (min-width: 768px) {
    ${props => props.verifying ? '' : 'width: 70%;'}
  }

  h5 {
    color: #3f3d4b;
    font-size: 32px;
    line-height: 44px;
    text-align: center;
  }
`
const Header = styled.div`
  ${props => props.nobg ? '' : 'background: #f9f9fa;'}
  padding: 30px 20px 10px 20px;
  position: relative;
  @media screen and (min-width: 768px) {
    padding: 40px 60px 20px 60px;
  }
`
const ButtonClose = styled.button`
  background: none;
  border: none;
  color: #3f3d4b;
  font-size: 2em;
  padding: 0;
  position: absolute;
  right: 20px;
  top: 20px;
`
const Body = styled.div`
  padding: 10px 20px 20px 20px;
  @media screen and (min-width: 768px) {
    padding: 20px 60px 0 60px;
  }
`
const Info = styled.p`
  color: #8986A0;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
`
const Footer = styled.div`
  padding: 0 20px 30px 20px;
  @media screen and (min-width: 768px) {
    padding: 10px 60px 40px 60px;
  }
`
const VerifyButton = styled.button`
  background: linear-gradient(49.62deg, #5c50ca 0%, #7958d8 100%);
  border-radius: 4px;
  color: #fff;
  font-weight: 700;
  padding: 20px;
  width: 100%;
`
const Progress = styled.div`
  align-items: center;
  background: url(${lightPatternBg});
  background-size: cover;
  color: #3f3d4b;
  display: flex;
  font-size: 20px;
  font-weight: 800;
  justify-content: center;
  height: 100vh;
  width: 100vw;

  & > .message:after {
    position: absolute;
    overflow: hidden;
    display: inline-block;
    vertical-align: bottom;
    -webkit-animation: ellipsis steps(4, end) 2s infinite;
    animation: ellipsis steps(4, end) 2s infinite;
    content: "\\2026";
    width: 0;
  }
  @keyframes ellipsis {
    to {
      width: 1.25em;
    }
  }
  @-webkit-keyframes ellipsis {
    to {
      width: 1.25em;
    }
  }
`
const RetryButton = styled.button`
  background: none;
  border: solid 2px #5c50ca;
  border-radius: 4px;
  color: #5c50ca;
  font-weight: 700;
  padding: 20px;
  width: 100%;
`
const ResultIcon = styled.img`
  display: block;
  margin: -30px auto 20px;
`
const ResultMessage = styled.p`
  text-align: center;
`
export default VerificationModal

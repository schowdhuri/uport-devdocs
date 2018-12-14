import React from 'react'
import styled from 'styled-components'

import CopyButton from './Configurator/CopyButton'
import { Container, Grid, Col, Spacer, medium } from '../../layouts/grid'
import copyToClipboard from '../../helpers/copyToClipboard'
import track, { trackPage } from '../../utilities/track'

const installCodeServer =
`npm init
npm install --save uport-credentials`

const installCodeClient =
`npm init
npm install --save uport-connect@1.1.0-alpha.12`

const initServerCode = (appName, network) =>
`import { Credentials } from "uport-credentials"

const uport = new Credentials('${appName}', {
  network: "${network}",
  privateKey: "<private key>"
})`.replace(/ +network: "none",\n/g, '')

const initClientCode = (appName, network) =>
`import { Connect } from "uport-connect"

const uport = new Connect('${appName}', {
  network: "${network}"
})`.replace(/ +network: "none",\n/g, '')

const requestCredentials =
`// Request credentials to login
uport.requestCredentials({
  requested: ["name", "phone", "country"},
  notifications: true // We want this if we want to recieve credentials
})
.then((credentials) => {
  //Do something
})`

const attestCredentials =
`// Attest specific credentials
uport.attestCredentials({
  sub: THE_RECEIVING_UPORT_ADDRESS,
  claim: {
    name: "value"
  },
  exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000 // 30 days
})`

const createDisclosureRequest =
`// in an express application
app.get("/", () => {
  credentials.createDisclosureRequest({
    notifications: true,
    callbackUrl: "/callback"
  }).then(requestToken => {
    // Do something
  })
})

app.post("/callback", (req, res) => {
  const jwt = req.body.access_token
  // Do something with the jwt
})`

const issueAttestation =
`// in an express application
import { transport } from "uport-transports"

app.get("/", () => {
  credentials.createDisclosureRequest({
    notifications: true,
    callbackUrl: "/callback"
  }).then(requestToken => {
    // Do something
  })
})
app.post("/callback", (req, res) => {
  const jwt = req.body.access_token
  credentials.authenticateDisclosureResponse(jwt).then(creds => {
    const did = creds.did
    const pushToken = creds.pushToken
    const pubEncKey = creds.boxPub
    const push = transports.push.send(creds.pushToken, pubEncKey)
    credentials.createVerification({
      sub: did,
      exp: Time30Days(),
      claim: {
        "My Title" : {
          "KeyOne" : "ValueOne",
          "KeyTwo" : "Value2",
          "Last Key" : "Last Value"
        }
      }
      // Note, the above is a complex claim. Also supported are simple claims:
      // claim: {"Key" : "Value"}
    }).then(att => {
      return push(att)
    })
})`

class AppCode extends React.Component {
  handleCopy = (str, id) => () => {
    copyToClipboard(str);
    this.track('App Code Copied', {
      value: str
    })
  }
  track = (name, properties={}) => {
    track(name, {
      source: 'App Details',
      ...properties
    })
  }
  render() {
    const { currentApp } = this.props
    const { environment } = currentApp.configuration;
    return (<Wrapper>
      {environment !== "server"
        ? <div>
          {!environment && <h3>Client Apps</h3>}
          <div className='detailsContainer'>
            <Step>
              <Step.Number>1</Step.Number>
              <Step.Label>Install Libraries</Step.Label>
              <Step.Content>
                <CopyButton
                  onCopy={this.handleCopy(installCodeClient)}>
                  Copy
                </CopyButton>
                <Scrollable>
                  <CodeContainer>
                    <Pre>
                      <Code>
                        {installCodeClient}
                      </Code>
                    </Pre>
                  </CodeContainer>
                </Scrollable>
              </Step.Content>
            </Step>
          </div>
          <div className='detailsContainer'>
            <Step>
              <Step.Number>2</Step.Number>
              <Step.Label>Initialize uPort Connect</Step.Label>
              <Step.Content>
                <CopyButton
                  onCopy={this.handleCopy(initClientCode(
                    currentApp.name,
                    currentApp.configuration.network
                  ))}>
                  Copy
                </CopyButton>
                <Scrollable>
                  <CodeContainer>
                    <Pre>
                      <Code>
                        {initClientCode(
                          currentApp.name,
                          currentApp.configuration.network
                        )}
                      </Code>
                    </Pre>
                  </CodeContainer>
                </Scrollable>
              </Step.Content>
            </Step>
          </div>
          <div className='detailsContainer'>
            <Step>
              <Step.Number>3</Step.Number>
              <Step.Label>Request Credentials</Step.Label>
              <Step.Content>
                <CopyButton
                  onCopy={this.handleCopy(requestCredentials)}>
                  Copy
                </CopyButton>
                <Scrollable>
                  <CodeContainer>
                    <Pre>
                      <Code>
                        {requestCredentials}
                      </Code>
                    </Pre>
                  </CodeContainer>
                </Scrollable>
              </Step.Content>
            </Step>
          </div>
          <div className='detailsContainer'>
            <Step>
              <Step.Number>4</Step.Number>
              <Step.Label>Attest Credentials</Step.Label>
              <Step.Content>
                <CopyButton
                  onCopy={this.handleCopy(attestCredentials)}>
                  Copy
                </CopyButton>
                <Scrollable>
                  <CodeContainer>
                    <Pre>
                      <Code>
                        {attestCredentials}
                      </Code>
                    </Pre>
                  </CodeContainer>
                </Scrollable>
              </Step.Content>
            </Step>
          </div>
        </div>
        : null}
      {environment !== "client"
        ? <div>
          {!environment && <h3>Server Apps</h3>}
          <div className='detailsContainer'>
            <Step>
              <Step.Number>1</Step.Number>
              <Step.Label>Install Libraries</Step.Label>
              <Step.Content>
                <CopyButton
                  onCopy={this.handleCopy(installCodeServer)}>
                  Copy
                </CopyButton>
                <Scrollable>
                  <CodeContainer>
                    <Pre>
                      <Code>
                        {installCodeServer}
                      </Code>
                    </Pre>
                  </CodeContainer>
                </Scrollable>
              </Step.Content>
            </Step>
          </div>
          <div className='detailsContainer'>
            <Step>
              <Step.Number>2</Step.Number>
              <Step.Label>Initialize Credentials</Step.Label>
              <Step.Content>
                <CopyButton
                  onCopy={this.handleCopy(initServerCode(
                    currentApp.name,
                    currentApp.configuration.network
                  ))}>
                  Copy
                </CopyButton>
                <Scrollable>
                  <CodeContainer>
                    <Pre>
                      <Code>
                        {initServerCode(
                          currentApp.name,
                          currentApp.configuration.network
                        )}
                      </Code>
                    </Pre>
                  </CodeContainer>
                </Scrollable>
              </Step.Content>
            </Step>
          </div>
          <div className='detailsContainer'>
            <Step>
              <Step.Number>3</Step.Number>
              <Step.Label>Create Disclosure Request</Step.Label>
              <Step.Content>
                <CopyButton
                  onCopy={this.handleCopy(createDisclosureRequest)}>
                  Copy
                </CopyButton>
                <Scrollable>
                  <CodeContainer>
                    <Pre>
                      <Code>
                        {createDisclosureRequest}
                      </Code>
                    </Pre>
                  </CodeContainer>
                </Scrollable>
              </Step.Content>
            </Step>
          </div>
          <div className='detailsContainer'>
            <Step>
              <Step.Number>4</Step.Number>
              <Step.Label>Issue Attestation</Step.Label>
              <Step.Content>
                <CopyButton
                  onCopy={this.handleCopy(issueAttestation)}>
                  Copy
                </CopyButton>
                <Scrollable>
                  <CodeContainer>
                    <Pre>
                      <Code>
                        {issueAttestation}
                      </Code>
                    </Pre>
                  </CodeContainer>
                </Scrollable>
              </Step.Content>
            </Step>
          </div>
        </div>
        : null}
    </Wrapper>)
  }
}
const Wrapper = styled.div`
  .detailsContainer {
    margin-bottom: 20px;
    p {
      font-size: 16px;
      font-weight: normal;
      margin: 20px 0;
    }
  }
`
const Step = styled.div`
  display: grid;
  grid-gap: 20px;
  grid-template-columns: 35px 1fr;
  grid-template-rows: auto auto;
`
Step.Number = styled.div`
  background: #62b482;
  border-radius: 50%;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  height: 30px;
  line-height: 30px;
  text-align: center;
  width: 30px;
`
Step.Label = styled.label`
  color: #3f3d4b;
  font-weight: 800;
  font-size: 16px;
  line-height: 30px;
  text-transform: none;
`
Step.Content = styled.div`
  grid-area: 2 / 1 / 3 / 3;
  overflow: auto;
  position: relative;
`
const Scrollable = styled.div`
  background: #f5f5fa;
  border: solid 1px #e3e3e4;
  border-radius: 4px;
  box-shadow: 0 0 4px 0 inset #e3e3e4;
  overflow: auto;
  ${medium(`
    height: 200px;
  `)}
`
const Code = styled.code``
const Pre = styled.pre`
  color: #606061;
  margin: 0;
  overflow: visible;
  padding: 40px 20px 20px;
`
const CodeContainer = styled.div`
  border-radius: 4px;
  overflow: visible;
`

export default AppCode


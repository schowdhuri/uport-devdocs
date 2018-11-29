import React, { Component } from 'react'
import resolve from 'did-resolver'
import registerResolver from 'https-did-resolver'

class AppResolver extends Component {
  constructor (props) {
    super(props)
    this.verifyDomain = this.verifyDomain.bind(this)
  }
  verifyDomain () {
    const publicAddress = this.props.appIdentity.did.replace('did:ethr:', '')
    registerResolver()
    resolve('did:https:' + this.props.appDetails.appURL).then(doc => {
      console.log(doc)
      console.log(doc.publicKey[0].ethereumAddress + ' | ' + publicAddress)
    })
  }
  render () {
    const did = this.props.appIdentity.did.replace('did:ethr:', '')
    return (
      <section>
        <header>
          <h2>Verify Domain (optional)</h2>
          <a href='/' className='cancel'>CANCEL</a>
        </header>
        <div className='module'>
          <label>Your DID Document</label>
          <p>To associate your domain with your App Identity just upload the following document to https://{this.props.appDetails.appURL}/.well-known/did.json </p>
          <pre><code style={{backgroundColor: '#f4f4f7'}} className={`language-javascript`}>
            {`
              {
                "@context": "https://w3id.org/did/v1",
                "id": "did:https:${this.props.appDetails.appURL}",
                "publicKey": [{
                  "id": "did:https:${this.props.appDetails.appURL}#owner",
                  "type": "Secp256k1VerificationKey2018",
                  "owner": "did:https:${this.props.appDetails.appURL}",
                  "ethereumAddress": "${did}"
                }],
                "authentication": [{
                  "type": "Secp256k1SignatureAuthentication2018",
                  "publicKey": "did:https:${this.props.appDetails.appURL}#owner"
                }]
              }
            `}
          </code></pre>
        </div>
        <div className={`myapps-button`}>
          <a href='#' onClick={() => this.verifyDomain()}>
            Verify
          </a>
        </div>
      </section>
    )
  }
}

export default AppResolver

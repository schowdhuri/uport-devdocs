---
title: "Request Verification Example"
index: 4
category: "uport-credentials"
type: "tutorial"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/credentials/verification.md"
---

# Introduction

Requesting verifications with your server application is the same process as creating a disclosure request as seen in the login flow of our previous example - [Creating Server-Side Verifications](/credentials/createverification).  This solution builds on the previous example, so in order to get the most of out this content it is advised to review how to [create verifications](/credentials/createverification) first.

Contrary to our example of how to create a verification using uport-credentials, our initial request will no longer be a general login request but will be a request for a specific piece of verified claim data.

![verification](https://plantuml-server.kkeisuke.app/svg/UDg5LKrlsa0GlVTNZ9nBUq19f980GbO0sqqhsjA4gfL23klrG5PPTjtTTJxQzBztR32nBKnzGDwTDs_Ul1cB2-kOSTbQlW5WcTCgMyTew63lXKgPOMimEbC9rqQXWTEJMcYidsOiIOHQDIDto18qaLPkegKsS7JMx_Q3SGlcMln6EEtLeXEwDrgEjI7GbkJzf1-EpcgmBzhX_p0MVsMeEC8VkWOO6QCVcsY03zHeEcRyVbLqtDHT0ggrmY2SHD5hyBBPzR9u2W1vjL_d9jIi6_H2YfVXYil5rOo69hX8cN9jf5L8axmYgm9h5XbnfqqR_IPuW3XKJhZdjlHjz41-m1oBcSKsXbty0CTKB74gL2l7N_gDzHDu4obGEI__2FA-uBEEXKGwyiqMWdSvdy_Wet9e226qye1PUCIuKWzLahELdDTe7j3adEchn-KrZDAqeE064oejcBHmTDxlze9UZQeQxzni4RT-KNe0CpHBRTR0QCSbah07X8LAXELIsymWc7prhGD2BHJL5Kk12N39n9h85NqyOCJgpi5HD0w3w8GuKsOjUDwGvtODI5Hq7aPTVnZxPVxmEFO7C1J-ZLSm0SrIedSxF1R-yBZ8yprleOG2TuUmHuxJrFlzFbKMukSyIvWDAwbyUNafjUhSkiBrdTn0s5IoP_ZqOqwsSPqG4_dAuDiL0ELjHWcTJkcPvKnHS4Vy2j3b-m1OcXegjXDCrKaaP_de5uhaRvj2gCjVA4XeCUjrgpCS06TInhIqyBPcZ4srilYkx5JYiZgKsTVhUUxQBldxrPGclQA1AzZwl6_mhHlqiw5gb145dQX5BDYiM2dgYcnTA8CkC_bftqGtmdEhBsXjwQ_a7naq4em0.svg)

At a high level, requesting a verification involves:

* Cryptographically sign a request to disclose user data on behalf of your server application.
* Send request as a JWT to your users via a QR, push, or another transport

The intention of this content is to provide a simple solution to bring familiarity to core concepts in uPort's ecosystem.  The following examples utilize the verification flow and request/response patterns to provide an example of how to use these concepts to request previously verified claims

- [Verified Claim Request Flow](/flows/verificationreq)
- [Verified Claim Request](/messages/verificationreq)
- [Verified Claims](/messages/verification)
- [Claims](/messages/claims)
- [Selective Disclosure flow](/flows/selectivedisclosure)
- [Selective Disclosure Request](/messages/sharereq)
- [Selective Disclosure Response](/messages/shareresp)

In addition to the above concepts and uport-credentials, also note the following requirements before starting this example:

- NodeJS
- Create a folder for the example and `cd ./example && npm init` 
- Install dependencies `npm install --save ngrok expressjs did-jwt uport-transports uport-credentials`

This content is best if followed by interacting with a node console.

## Setup

The first order of business to creating any server side solution with uport-credentials is to obtain an application identity.  These identities are used to configure a uport-credentials object and can also be thought of as an ethereum key pair with a few extra capabilities made possible by adhering to [ERC-1056](https://github.com/ethereum/EIPs/issues/1056).

After installing `uport-credentials` as a dependency, create the *application identity* that will be used to sign requests:

```js
const { Credentials } = require('uport-credentials');
Credentials.createIdentity();
```
##### Output:

```json 
{ 
  did: 'did:ethr:0x31486054a6ad2c0b685cd89ce0ba018e210d504e',
  privateKey: 'ef6a01d0d98ba08bd23ee8b0c650076c65d629560940de9935d0f46f00679e01' 
}
```
Save the output from the identity creation for later.  Please note that the private key *should* be kept secure!  The private key shown in this guide is for *information purposes* only.

### Boilerplate

First, require and configure dependencies.  Their usage will be explained later, however you should change this boilerplate code swapping the proper `appName`, `did`, and `privateKey` that was obtained during [setup](#setup) to instantiate a new Credentials() object. 

```js
const express = require('express')
const bodyParser = require('body-parser')
const ngrok = require('ngrok')
const decodeJWT = require('did-jwt').decodeJWT
const { Credentials } = require('uport-credentials')
const transports = require('uport-transports').transport
const message = require('uport-transports').message.util

let endpoint = ''
const app = express();
app.use(bodyParser.json({ type: '*/*' }))

//setup Credentials object with newly created application identity.
const credentials = new Credentials({
  appName: 'Request Verification Example',
  did: 'did:ethr:0x31486054a6ad2c0b685cd89ce0ba018e210d504e',
  privateKey: 'ef6a01d0d98ba08bd23ee8b0c650076c65d629560940de9935d0f46f00679e01'
})
```

## Request Verifications

For the purposes of this exercise we need to request a credential that is identified by it's title using a [selective disclosure request](/messages/sharereq). 

We need to provide an endpoint to ask for verified credentials from the user.  In this situation we are including a request for a verified claim with the `verified` array.   Changing the keys in this array will request different pieces of data from the user, and they’ll be prompted to approve the verifications that you request.  During [part 1](/credentials/createverification), we showed you how to create a verification named 'Example', so that is the claim title we will request for this example.  If you have not followed allowing from [Part 1](/credentials/createverification), you may need to change the key in the `verified` array accordingly.
      
```js
app.get('/', (req, res) => {
  credentials.createDisclosureRequest({
    verified: ['Example'],
    callbackUrl: endpoint + '/callback'
  }).then(requestToken => {
    console.log(decodeJWT(requestToken))  //log request token to console
    const uri = message.paramsToQueryString(message.messageToURI(requestToken), {callback_type: 'post'})
    const qr =  transports.ui.getImageDataURI(uri)
    res.send(`<div><img src="${qr}"/></div>`)
  })
})
```

In the disclosure request above, we set the `callbackUrl` field to the endpoint that will be created in the next step.  Once this route is hit with the proper payload a verification will be created from the information contained in the signed JWT access token that is returned in the [disclosure response](/messages/shareresp).


```js
app.post('/callback', (req, res) => {
  const jwt = req.body.access_token
  console.log(jwt)
  console.log(decodeJWT(jwt))
  credentials.authenticateDisclosureResponse(jwt).then(creds => {
    //validate specific data per use case
    console.log(creds)
    console.log(creds.verified[0])
  }).catch( err => {
    console.log("oops")
  })
})

// run the app server and tunneling service
const server = app.listen(8088, () => {
  ngrok.connect(8088).then(ngrokUrl => {
    endpoint = ngrokUrl
    console.log(`Verification Service running, open at ${endpoint}`)
  })
})

```

Once we have the JWT, the next step is to validate it. We use the `authenticateDisclosureResponse()` function first. This validates the JWT by checking that the signature matches the public key of the issuer. This validation is done both for the overall JWT and for the JWTs that are sent in the larger payload. You may also want to verify additional data in the payload specific to your use case.


## Running the Service

Combining everything and running it will display a message in the terminal like `Verification Service running, open at https://f70c25bd.ngrok.io`. 

All that is left to do is to try it out!

- Open a browser and navigate to this URL to generate a QR code.
- Scan the QR with the uPort mobile client
- Approve (or deny) the disclosure request
- Inspect the output in the console

To test everything, try checking for a different attestation and make sure it fails. We also recommend waiting until the request expires to confirm that the response fails &mdash at which point you’ll witness an error message.

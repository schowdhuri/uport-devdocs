---
title: "Create Verification Example"
index: 3
category: "uport-credentials"
type: "tutorial"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/credentials/verification.md"
---

# Introduction

Creating and issuing verifications from your server application is a simple matter of utilizing uport-credentials to create them and setting up a few endpoints to facilitate the flow.

This guide builds upon our [server login example](/credentials/login) but we will go cover this portion again because previously where we "login" a user, we will also now issue them a verification.

![verification](https://plantuml-server.kkeisuke.app/svg/UDg5LKrpqq0ClVChDEabFNH86LgI79ZcamA1cYOC1yfXOyl9JjUIsLtt0uR_ZkmaZMtgaCbax7rFJtgIx5muhwpF4lC2G6MUAKkMQEN6tMfAbLK9MCue2jaIMZZjLA0XFmGgYZIjwiWQLOHsokH7RDZ2qNdlh3SUDd3c-XV2QRU2ZkJSiXco5T9MvFMeDncSLsYVsUF_E0v_PaWXmcyv1XXOo_TrDi0xCPeELNYxAXpNwzuHohacuybeEjs3btNNSV4f2DAhv-lSGFMyu-v4y1rSwd9n5CZGTAXJHRv9j4ofYvVAAj7gIGQXPzialm4F24_8Q__O5Bv53yIFbLTBvR19uGa_e37JCSuqDMhyaTybFq1hP3IIR-KFGUuBFl5I6vJRSBE5qBfSB09uJnwjC3HJ2vI3UroMyY55kTfESuxs3cskcUvxl3k6GPeM4g75I59hPHmSlUcTTSVTYbGPF_c-PVnuMwJkGu0sPfk0aXqtA8NT8TnGf5res6KMmUQhxxm8aJmem7dgekhfS3AUTaJYmxU5f0ivmYYlHy6NQs5l6W0d9xjCBbJq3xIzx8DAKolQfNGbLjb27q9bp59c1krAcIvbSdYyAzHWx4j51bVp1NZU1t-zdedHbVWbq0H-tUYxeO5SAylmIdGEDBnA7rbKKgQqKySwLFb6G6mvWMTC7H1zQc2GkNNkVA_cX9zRpWAs7f8DKVfyO9G38-j9Ajy2ymYPmnlAnmdtBw5ONxrVN-cM9kVbVGKSoz2B_3TKhg0on8UQ_rUT3bnzX7OWdhL3k4QVMJgknF3skWzplI9eRvVak9XMfNEXKJgHMFbUoEhBtz5VGwubB000.svg)

Issuing verifications helps users build their digital identity.  At a high level, issuing a verification involves:

* Cryptographically signing user data on behalf of your server application
* Send verifications as a JWT to your users via a QR, push, or another transport

By presenting a verification to a user, you are cryptographically signing a claim about that user, and as a result, attesting to the truth of a peice of information about them. Anyone who has access to your application's DID can then confirm that a specific verification for an identity came from your dApp. 

Attesting to information about your users will enable them to build up their digital identity and add real value to your dApp. For example, if your dApp is a social platform that requests and verifies a user’s phone number and email address during on-boarding, then that user can receive a verification that they are not a bot. This allows them to have a frictionless “proof of being a human” verification across the decentralized web.  

The intention of this content is to provide a simple solution to bring familiarity to core concepts in uPort's ecosystem.  The following examples utilize the verification flow and request/response patterns to provide an example of how to use these concepts to issue verified claims:

- [Send Verification Flow](/flows/verification)
- [Verified Claims](/messages/verification)
- [Claims](/messages/claims)
- [Selective Disclosure flow](/flows/selectivedisclosure)
- [Selective Disclosure Request](/messages/sharereq)
- [Selective Disclosure Response](/messages/shareresp)

In addition to the above concepts and uport-credentials, also note the following requirements before starting this example:

- NodeJS
- Create a folder for the example and `cd ./example && npm init` 
- Install dependencies `npm install --save ngrok express did-jwt uport-transports uport-credentials`

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
  appName: 'Create Verification Example',
  did: 'did:ethr:0x31486054a6ad2c0b685cd89ce0ba018e210d504e',
  privateKey: 'ef6a01d0d98ba08bd23ee8b0c650076c65d629560940de9935d0f46f00679e01'
})
```

## Create and Issue Verifications

Next, we need to provide an endpoint to ask for credentials from the user.  This will be done by creating a simple "login" endpoint that will request permissions for push notifications.  This is exactly similar to our login example, only in this situation we are not requesting specific examples.   For the purposes of this exercise we need the user's DID to create the verification, which will be done while handling the response from the following [selective disclosure request](/messages/sharereq).

```js
app.get('/', (req, res) => {
  credentials.createDisclosureRequest({
    notifications: true,
    callbackUrl: endpoint + '/callback'
  }).then(requestToken => {
    console.log(decodeJWT(requestToken))  //log request token to console
    const uri = message.paramsToQueryString(message.messageToURI(requestToken), {callback_type: 'post'})
    const qr =  transports.ui.getImageDataURI(uri)
    res.send(`<div><img src="${qr}"/></div>`)
  })
})
```

This `Credentials` object can create messages *containing* or *requesting* verified data. At the default route, we have a handler set up with `app.get('/')`, which simply calls the `createDisclosureRequest()` method on our new credentials object. The disclosure request is a JWT, signed by our newly created identity, that requests specific information from the user. More specifically, we request the ability to send push notifications to the user by including the `notifications: true` key-value pair. When a user receives a request on their mobile app, they are asked to approve the disclosure of the requested attributes and their Decentralized Identifier or `DID`.

To get this request to the user's mobile app, we can use a number of "transports" provided by the `uport-transports` library. The details of all the available transports are outside the scope of this tutorial, but there are helpers available for using QR codes, push notifications, mobile-specific URLs, custom messaging servers, and others. In the above endpoint, we present the request to the user in the form of a QR code, using `transports.ui.getImageDataURI`, after converting the JWT into a request URI. The QR code is displayed on the page that is viewed by the user.

_**Note:** There are several forms of transports to consider. This tutorial focuses on the practical side of requesting and exchanging credentials. For more information on transports, please visit the [Transports repository](https://github.com/uport-project/uport-transports).

Once you scan the QR code with your mobile app, you will receive an alert informing you that you are about to share information.

In the disclosure request above, we set the `callbackUrl` field to the endpoint that will be created in the next step.  Once this route is hit with the proper payload a verification will be created from the information contained in the signed JWT access token that is returned in the [disclosure response](/messages/shareresp).

```js
app.post('/callback', (req, res) => {
  const jwt = req.body.access_token
  credentials.authenticateDisclosureResponse(jwt).then(creds => {
    // take this time to perform custom authorization steps... then,
    // set up a push transport with the provided 
    // push token and public encryption key (boxPub)
    const push = transports.push.send(creds.pushToken, creds.boxPub)

    credentials.createVerification({
      sub: creds.did,
      exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
      claim: {'Identity' : {'Last Seen' : `${new Date()}`}}
      // Note, the above is a complex (nested) claim. 
      // Also supported are simple claims:  claim: {'Key' : 'Value'}
    }).then(attestation => {
      console.log(`Encoded JWT sent to user: ${attestation}`)
      console.log(`Decodeded JWT sent to user: ${JSON.stringify(decodeJWT(attestation))}`)
      return push(attestation)  // *push* the notification to the user's uPort mobile app.
    }).then(res => {
      console.log(res)
      console.log('Push notification sent and should be recieved any moment...')
      console.log('Accept the push notification in the uPort mobile application')
      ngrok.disconnect()
    })
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
The verification requires three fields: `sub`, which identifies the *subject* of the claim; `exp`, which is the Unix epoch timestamp, in seconds, in which the claim should no longer be considered valid; and `claim`, which contains the data being signed. The claim can be any serializable JavaScript object (e.g., JSON), so feel free to edit the keys and values of the claim to anything you would like to issue to your users.  See [claims best practices](/messages/verification#claims-best-practices) for advice on how to get the most of the verifications you issue.

Notice that we set the `sub` field of the claim to the `DID` of the user — a piece of information that is disclosed to us during the login flow after scanning the QR code with the uPort mobile app.

The `createVerification()` function returns a promise that resolves to a JWT like the following.  A push notification will appear in the mobile app of the user who has just scanned the QR code, containing the verification below:

```json
{
  "header": {
    "typ": "JWT",
    "alg": "ES256K-R"
  },
  "payload": {
    "iat": 1541137834,
    "sub": "did:ethr:0xcf311e53e3b7b27c4a7ccd9a0f31b68f659e8291",
    "claim": {
      "Example": {
        "Last Seen": "Fri Nov 02 2018 01:50:34 GMT-0400 (EDT)"
      }
    },
    "exp": 1543729834,
    "iss": "did:ethr:0x31486054a6ad2c0b685cd89ce0ba018e210d504e"
  },
  "signature": "Fm3_0Bh-5YrEeHOVSCQbukYfFRphJqL07IEWZb7RvH7S7_EFF8YsdsV31c58qyS8jO-ML24ursVl_dZ4ikQSTgA",
  "data": "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NDExMzc4MzQsInN1YiI6ImRpZDpldGhyOjB4Y2YzMTFlNTNlM2I3YjI3YzRhN2NjZDlhMGYzMWI2OGY2NTllODI5MSIsImNsYWltIjp7IkV4YW1wbGUiOnsiTGFzdCBTZWVuIjoiRnJpIE5vdiAwMiAyMDE4IDAxOjUwOjM0IEdNVC0wNDAwIChFRFQpIn19LCJleHAiOjE1NDM3Mjk4MzQsImlzcyI6ImRpZDpldGhyOjB4MzE0ODYwNTRhNmFkMmMwYjY4NWNkODljZTBiYTAxOGUyMTBkNTA0ZSJ9"
}

```

This time, we will make use of another transport from the `uport-transports` library (specifically, `transports.push.send`) to send the JWT as a push notification, without requiring the user to scan another QR code. This transport requires a public encryption key and a push token of the user to whom it’s being sent to — both of which are included in the initial disclosure response.

## Running the Service

Combining everything and running it will display a message in the terminal like `Verification Service running, open at https://f70c25bd.ngrok.io`. 

All that is left to do is to try it out!

- Open a browser and navigate to this URL to generate a QR code.
- Scan the QR with the uPort mobile client
- Approve (or deny) the disclosure request
- Inspect the output in the console

---
title: "Transaction Signing Example"
index: 5
category: "uport-credentials"
type: "tutorial"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/credentials/transactions.md"
---

# Introduction

It is possible with uport-credentials to create an ethereum transaction request and have a mobile client approve and sign that transaction.

In order to facilitate this flow we will build upon our basic [server login example](/credentials/login).  It is necessary to perform this step to request information that will be used to create a transaction.

![transaction](https://plantuml-server.kkeisuke.app/svg/UDg5LKrlqq0GlVChHkcbFLIaYBP93gZvi2dGKjC4WKGvREnnkkfwn-ok-m7YlpDsucPjSB0iozvv--RDcx5zPfqmhiZK2m1HED95jaJ33_PEwbmOaO6XGYSn6Oq6ZlgDq8GU8v4aKg_QaLiK2PgGj9kI8WDx9yFZuMpIWPdBdmX7WqPqokk6r8GCWpOahwV3O7pIW7qaX__3MFnHe8uHVl4omDWOUcYZ0TvoeVb4n7UhgkAsxXhWvmfcmJGCjy7pTjLfTLG0zkhVEjUXTjxP8E1u7VPShfOYRfgCPIwqwoBr8MroJvO7QoSPnuvC5_qwk8Cuq4wwfwxjc-YE_JFXn59Ox69uZk_Wk90fNaZToV6RhqjwXDvKITIkLxu4PLrmIKkfa1_ZzHH2xtonYE2TTcWO8KdtG5XumAMN3tLIijMSSpJtQ4hEVEjnlGpZFAyeOeC9fvP2MTWx3K-3yBX1vSSFl-sT3ey7iy7tDrNg4KHeKZ8P29vnXIpi7k569zB6YcnX44mv-jOnaUON1QXCNQaE9y4ix3F5-oyBJXTJWacfHy2dQqQl3O33mpgJZON-AxIv7O78SyFSNZeFvPSmWbWejUIUmNv3fir9MpoeXIfCdISokfelmD5sy-Vh2ovqnVLga1hSRMVT7GPIIvQY5VFiCBm9dneKB7FnjSu4gQ4CDWhOIW--W_JPmAYmjsNbCfMnAEUB6yhJmYKN4Ha7sHh8FkzevLZnU6fHJe5wWiBYZIxR2GyleHfVkHrVTajgw_Xx1PHoqwlyDzfNq6WYRUv7C9Sh3VkRXXzKpWTyCLXaR4TZqsFBj5VzFbnzWFs8hP8MuHfTONJPSpxFUERvF_G7wGeXbm00.svg)

Different types of transactions can be requested and signed.  For this example we will focus on a value transfer transaction, but you can also create and call smart contract functions.

Because transactions do cost a fee, specifically a gas fee paid in WEI, an Ethereum account with enough ether is needed to exercise the code in this guide.  The code examples will utilize the Rinkeby network so this will not require real mainnet ether.  From inside the uPort mobile app, you can find the wallet address for an account by clicking on: *Accounts* > *then the account you wish to fund* > *Add funds*

**Note** - *do not use real ether for this tutorial!  Only use _Rinkeby_ ether from a rinkeby wallet.**

This guide utilizes the Ethereum Transaction Request flow and Selective Disclosure request/response patterns to provide an example of how to use these concepts to create a transaction request

- [Ethereum Transaction Request](https://github.com/uport-project/specs/blob/develop/messages/tx.md)
- [Ethereum Transaction Request flow](https://github.com/uport-project/specs/blob/develop/flows/tx.md)
- [Signed Transaction Request JWT](https://github.com/uport-project/specs/blob/develop/messages/tx.md#signed-transaction-request)
- [Transaction types](https://github.com/uport-project/specs/blob/develop/messages/tx.md#transaction-request-validity)
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

## Create Transaction Request

Next, we need to provide an endpoint to ask for credentials from the user.  This will be done by creating a simple "login" endpoint that will request permissions for push notifications.  This is similar to our login example, only in this situation we specifically ask for a `keypair` account, and we are making sure to specify the Rinkeby network id `0x4`.

```js
app.get('/', (req, res) => {
  credentials.createDisclosureRequest({
    notifications: true,
    accountType: 'keypair',
    network_id: '0x4',
    callbackUrl: endpoint + '/callback'
  }).then(requestToken => {
    console.log(requestToken)
    console.log(decodeJWT(requestToken))  //log request token to console
    const uri = message.paramsToQueryString(message.messageToURI(requestToken), {callback_type: 'post'})
    const qr =  transports.ui.getImageDataURI(uri)
    res.send(`<div><img src="${qr}"/></div>`)
  })
})

```

For the purposes of this exercise we need the user's address information contained in their DID in order to send a transaction request, which will be done while handling the response from the following [selective disclosure request](/messages/sharereq).

Once the response is received at the following callback, the access token can be passed to `authenticateDisclosureResponse()` where the response signature is validated.  With a validated response a transaction request can be created.


```
app.post('/callback', (req, res) => {
  console.log("Callback hit")
  const jwt = req.body.access_token
  credentials.authenticateDisclosureResponse(jwt).then(creds => {
    // take this time to perform custom authorization steps... then,
    // set up a push transport with the provided 
    // push token and public encryption key (boxPub)
    const push = transports.push.send(creds.pushToken, creds.boxPub)

    const txObject = {
      to: creds.mnid,
      value: '10000000000000000',
    }

    credentials.createTxRequest(txObject, {callbackUrl: `${endpoint}/txcallback`, callback_type: 'post'}).then(attestation => {
      console.log(`Encoded JWT sent to user: ${attestation}`)
      return push(attestation)  // *push* the notification to the user's uPort mobile app.
    }).then(res => {
      console.log(res)
      console.log('Push notification sent and should be recieved any moment...')
      console.log('Accept the push notification in the uPort mobile application')
    })
  })
})
```
Compared to our other solution guides, there is a lot going on in our authentication callback.  After authenticating the disclosure request a transaction object is created from data contain in the disclosure response JWT.  For the use case of a value transfer, we can assign the mobile client's MNID at the `to` address of the transaction object.  A `value` field with a string representing WEI is also required.  To see what else may be required for other transaction flows please reference the transaction request [specifications](https://github.com/uport-project/specs/blob/develop/messages/tx.md#transaction-request-validity).

There are several attributes that can be added to the transaction request.  To see what else can be configured, check out our transaction [JWT specification](https://github.com/uport-project/specs/blob/develop/messages/tx.md#signed-transaction-request).  In this example we have included a `callbackURL` and `callback_type` attribute.  This has been added to post the successful transaction hash to.  Below, the final callback in this flow does very little other than log the transaction hash.

```
app.post('/txcallback', (req, res) => {
  console.log("txCallback hit")
  console.log(req.body)
  ngrok.disconnect()
})
```

## Running the Service

```
// run the app server and tunneling service
const server = app.listen(8088, () => {
  ngrok.connect(8088).then(ngrokUrl => {
    endpoint = ngrokUrl
    console.log(`Tx-Signing Service running, open at ${endpoint}`)
  })
})
```

Combining everything and running it will display a message in the terminal like `Tx-Signing Service running, open at https://f70c25bd.ngrok.io`. 

All that is left to do is to try it out!

- Open a browser and navigate to this URL to generate a QR code.
- Scan the QR with the uPort mobile client
- Approve (or deny) the disclosure request
- Wait for the eventual push notification, and approve (sign) the transaction
- Inspect the output in the console

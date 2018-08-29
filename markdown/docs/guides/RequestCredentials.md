---
title: "Requesting Credentials"
index: 2
category: "guides"
type: "content"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/guides/RequestCredentials.md"
---

# Requesting Credentials

Credentials are cryptographically signed messages containing information about a subject identity. They can be used by a decentralized system to authenticate users and enable interactions with data they control. uPort connect provides convenient functions that allow your application to request credentials from a user's uPort mobile app and handle the response.

## Authenticating a user

A user can be authenticated by issuing a request for their identity calling the `requestDisclosure` method of a `uport-connect` instance. By default, this request will be displayed as a link that attempts to open the uPort app if your application is accessed through a mobile client. On non-mobile clients, the request will be displayed as a QR code that can be scanned by a uPort mobile app. To learn more about how messages are passed between your app and a uPort client, check out [uport-transports](https://github.com/uport-project/uport-transports)

```js
// calling with no args requests the user's identity by default
uport.requestDisclosure()
```

Once the user approves the disclosure, their identity can be received as a promise returned by calling `onResponse`. It comes in the form of a [did](https://w3c-ccg.github.io/did-spec/#decentralized-identifiers-dids) that can be found in the `res.did` attribute of the response payload. `uport-connect` guarentees that the user your app is communicating with controls the identifier that they disclosed. To learn more about this process, check out our guide on [verifying JWTs](TODO: FIND LINK FOR THIS)

```js
uport.onResponse('disclosureReq').then(payload => {
  console.log(payload)
  // {
  //   "data": undefined
  //   "id": "disclosureReq",
  //   "res": {
  //     "boxPub": undefined,
  //     "did": "did:uport:23fga3r2hh87ddhq98dhas8dz101j9f449w0",
  //   }
  // }
})
```

## Requesting specific credentials

You can request specific credentials by submitting an array of values in an array of the `requested` key of a passed object. 

```js
uport.requestDisclosure({
    requested: ['name', 'avatar', 'phone', 'country'],
})
```

This allows your app to use data about the user without having to store or control it. However, this means that your app also has to make some judgement about the veracity of that data. The only information that is guaranteed at this point is that the data has not been modified, and was created by the issuer identity about the user.

```js
uport.onResponse('disclosureReq').then(payload => {
  console.log(payload)
  // {
  //   "data": undefined
  //   "id": "disclosureReq",
  //   "res": {
  //     "avatar": "https://ipfs.infura.io/ipfs/QmaqGAeHmwAi44T6ZrSuu3yxwiyHPxoE1rHGmKxeCuZbS7DBX",
  //     "name": "Agent Smith",
  //     "phone": "+1-231-452-3857",
  //     "country": "US",
  //     "boxPub": "dgH1devHn5MhAcph+np8MI4ZLB2kJWqRc4NTwtAj6Fs=",
  //     "publicEncKey": "dgH1devHn5MhAcph+np8MI4ZLB2kJWqRc4NTwtAj6Fs=",
  //     "did": "did:uport:23fga3r2hh87ddhq98dhas8dz101j9f449w0",
  //   }
  // }
})
```

## Enabling Push Notifications

When a transaction is going to be signed, if the `notifications` flag is set to `true` **it will allow any future transaction signing to fire a prompt in the uPort mobile app.** For UX considerations, we encourage developers to use this, otherwise your users will have to scan a QR code per each interaction.

```js
uport.requestCredentials({
  requested: ['name', 'avatar', 'phone', 'country'],
  notifications: true
  }).then((userProfile) => {
    // Do something after they have disclosed credentials
})
```

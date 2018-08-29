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
uport.requestCredentials({
  requested: ['name', 'avatar', 'phone', 'country'],
  }).then((userProfile) => {
    // Do something after they have disclosed credentials
})
```

## Verifying credentials

To verify the signature on a credential you have received, pass the JWT given in the response to the uPort JS `credentials.receive()` function, which will look up the user's public key in the [uPort Registry](https://developer.uport.me/pki/index) and confirm it matches the credential's signature.

```js
const JWT = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJyZXF1Z....'

credentials.receive(jwt).then((creds) => {
  if (creds.address == creds.verified[0].sub)
  {
    console.log('Credential verified.');
  } else {
    console.log('Verification failed.');
  }
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

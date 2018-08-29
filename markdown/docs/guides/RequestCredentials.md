---
title: "Requesting Credentials"
index: 2
category: "guides"
type: "content"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/guides/RequestCredentials.md"
---

# Requesting Credentials

Credentials are cryptographically signed messages containing information about a subject identity. They can be used by a decentralized system to authenticate users and enable interactions with data they control. uPort connect provides convenient functions that allow your application to request credentials from a user's uPort mobile app and handle the response.

## Calling the request method

**By default** the `uport-connect` library will fire a QR image inside of an injected global modal to help you get up and running quickly.

**This can be disabled** by intercepting the URI so you may use another library to customize the look and feel of the QR image.

Once the user has scanned the displayed QR image, and has submitted their credentials, the promise should resolve with a Schema.org person JSON data payload. You can then handle this data however you desire in the then function.

```js
// Basic usage with modal injection
uport.requestCredentials()
     .then((userProfile) => {
       // Do something after they have disclosed credentials
})
```

The expected payload should look like:

```js
{
  "@context":"http://schema.org",
  "@type":"Person",
  "name":"Agent Smith",
  "address":"23fga3r2hh87ddhq98dhas8dz101j9f449w0",
  "avatar": {
    "uri": "https://ipfs.infura.io/ipfs/QmaqGAeHmwAi44T6ZrSuu3yxwiyHPxoE1rHGmKxeCuZbS7DBX"
  },
  "country": "US"
  "network":"rinkeby",
  "publicEncKey": "dgH1devHn5MhAcph+np8MI4ZLB2kJWqRc4NTwtAj6Fs="
  "publicKey":"0x04016751595cf2f1429367d6c83a826526g613b4f7574af55ded0364f0fb34600bceba9211e5864ae616d7e83b5e3c79f1c913b40c8d38c64952fef383fd3ad637",
}
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

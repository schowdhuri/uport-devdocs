---
title: "Attesting Credentials"
index: 3
category: "uport-connect"
type: "guide"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/guides/AttestCredentials.md"
---

# Attesting Credentials

One of the core needs of Web 3.0 is to build trust in a self-sovereign world. We establish facts which are not mathematically derived by social consensus. To create social consensus, actors must attest to things being true. uPort provides tools for creating and transferring these credentials between entities represented by Ethereum-based identities.

## Requesting the user to sign a credential

Your app can generate a claim about any identity and request that the user signs it to create a credential.  Read about [working with JWTs](/did-jwt/guides/index.md) to learn more about this process. Once the credential is received, it can be stored and shared with other users or apps.

```js
const unsignedClaim = {
  sub: 'did:ethr:0x413daa771a2fc9c5ae5a66abd144881ef2498c54',
  claim: {
    'citizen of cryptoville': {
      'allowed to vote': true,
      'document': 'QmZZBBKPS2NWc6PMZbUk9zUHCo1SHKzQPPX4ndfwaYzmPW',
    }
  }
}
uport.createVerificationRequest(unsignedClaim)

uport.onResponse('signClaimReq').then(payload => {
  // do something with the signed credential
})
```

## Relaying an existing credential

Credentials issued to the user from outside the app can sent to them from the app as well. Learn more about creating credentials from our [server-side credentials tutorial](/uport-js/guides/server-side-credentials-example.md).

```js
const credential = 'eyJ0eXAiOiJKV1QiLCJh...' // some credential JWT
uport.send(credential, 'existingCredential')

uport.onResponse('existingCredential').then(payload => {
  // do something once the user accepts the credential
})
```

## Signing a credential about the user in app

Credentials issued from a client-only app using `uport-connect` will be signed by a generated identity. This is due to not being able to use a signing key while concealing it from the user without a server.

```js
uport.attest({
  sub: 'THE_RECEIVING_UPORT_ID',
  claim: { CUSTOM_PROPERTY: PROPERTY_VALUE },
  exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000,  // Optional expiration
})
```

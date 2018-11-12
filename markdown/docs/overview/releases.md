---
title: "Releases"
index: 1
category: "releases"
type: "overview"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/overview/releases.md"
announcement: "New Major Releases with Breaking Changes!  See https://developer.uport.me/releases for more info."
announcementType: "negative"
---

# Releases

## Uport Connect

### What's new in 1.0?

With the release of uPort Connect `v1.0.0`, there are a number of changes to our API -- the main differences to watch out for are described in this document, and the full API reference can be found [here](https://developer.uport.me/uport-connect/reference/index).

#### `ConnectCore` -> `Connect`
First, on the module level, there is no longer a `ConnectCore` class.  All core functionality is now implemented by the `Connect` object, instantiated as `new Connect(appName, opts)`.  Supplemental "transports" which facilitate communcation with the mobile app have moved to a new repository, [`uport-transports`](https://github.com/uport-project/uport-transports). The transports used in `Connect` are configurable, and you also have the option of providing custom transports in the constructor.  See the `transport`, `pushTransport`, and `mobileTransport` options in the configuration object.

#### No public keys in the browser
There was previously confusion about how to keep private keys safe when `Connect` required its own keypair in order to sign messages.  To aleviate this, we no longer require that `Connect` is instantiated with a `privateKey` or `signer`; instead, when a `Connect` is instantiated for the first time on a particular site, it generates a new keypair in the browser to serve as the *instance*'s identity.  This is the identity that will sign requests to a mobile app, and the mobile app user can confirm that subsequent requests come from the same identity.  It is still the case that signing a claim with a particular unique identity (which may belong to your application or company) requires that the keypair for that identity be stored somewhere secure (such as a server), and client

#### `localStorage` Persistance
As mentioned above, the keypair that is created on construction of the `Connect` object is saved to localStorage, and is used to re-instantiate the object with the same keypair when the site is reloaded.  Additionally, the `did` and `address` of the most recently authenticated user, and any verified claims they have shared with the application are persisted in localStorage, so that they need not be requested again when a user revisits the page.  Note that this does not share the information with any external service, and is intended to allow applications to maintain something akin to a session without storing a user's information on a server.  For more information about controlling the persistance behavior of `Connect`, see the API [reference](https://developer.uport.me/uport-connect/reference/index)

#### New functions `logout`, `reset`
To clear all saved data about a user from the browser, use the `logout()` method.  To additionally destroy the keypair, and so the application's identity, use `reset()`.  Note that following a reset, the user will be prompted to create a new identity in the mobile app upon the next interaction, and will not be able to associate the new browser identity with the old.

#### `mnid`, `address`, `did`
With v1.0, we have changed our underlying architecture to use [Decentralized Identifiers](https://w3c-ccg.github.io/did-spec/) (DIDs) as our primary ID.  We retain support for old identities via the `did:uport:` did method, while new accounts are created using the `ethr:did:` did method.  The `did` of the currently authenticated user is readable from a connect instance as `connect.did`.  The `address` field now returns the ethereum address of the currently authenticated user, and the `mnid` field is an encoding of the `address` along with the network id, described further [here](https://github.com/uport-project/mnid).

#### `<request>.then()` -> `onResponse(requestId).then()`
In order to address issues that can arise with page reloading when switching between mobile browsers and the uPort app, this release decouples the concepts of *requests* and *responses*.  Where previously a request would return a promise which would resolve when the response was available, now each request requires a `requestId`, which is then used to listen for the response.  This is a much more powerful pattern, that allows for more customized handling of requests and responses potentially on different pages of an app, and the request flow itself is stateless with respect to the browser.

#### `requestAddress` -> `requestDisclosure`
The `requestAddress` function has been removed, and `address` and `did` are returned by default for all disclosure requests.  Use `requestDisclosure()` instead.

#### `attestCredentials` -> `sendVerification`
Renamed to make names more consistent across our libraries.

#### `request` -> `send`
This is the function that sends a pre-signed JWT to the mobile app using the appropriate transport.  It was renamed to clarify it's role as the function that actually invokes the transports.

#### `(new Connect(appName, {provider})).getProvider()` -> `connect.getProvider(provider)`
By default, `uport-connect` now uses `ethjs` as our base web3 provider.  To pass a different base provider onto which uport functionality should be applied, pass the provider instance to the `getProvider` instance method, and the returned `UportSubprovider` will wrap the given provider.  **Note:** some providers may not play nicely with the added uport functionality. 

#### `connect.getWeb3` removed
To reduce bundle size for those who do not need it, we no longer bundle `web3` with `uport-connect`.  To get a `web3` object configured with uPort functionality, created a new `web3` instance with the `UportSubprovider` returned by `getProvider`, i.e.
```javascript
const web3 = new Web3(connect.getProvider())
```

### What's New in Version 0.7.8 (minor release)


[uport-connect@0.7.8](https://github.com/uport-project/uport-connect/releases/tag/v0.7.8)

* Backward compatible Ethr-DID response support that allows communication with IDs created with the ethr-did registry in the upcoming uPort mobile client release.
* Use the networkAddress key/value received in responses for all blockchain interactions if you have not already switched from using the address key/value. A networkAddress will continue to be a MNID encoded address for the network your app is configured for. It you are using the uPort subProvider this already happens by default. Continue to use the address key/value as you have for all other interactions (i.e as the subject for attestations issued). In the transition to DIDs the address key/value in a response may be a DID or MNID, but the libraries will set this appropriately to support both new and old mobile app identities.

#### *Steps to migrate*

* npm install uport-connect
* Use networkAddress key/value in response for all blockchain interactions instead of address key/value if you have not switched already. Continue to use address key/value for all other interactions (i.e attestations). This change may not be required, its dependent on your current implementation.

#### *Legacy support*

* Versions _[0.7.3](https://github.com/uport-project/uport-connect/tree/v0.7.3)_ and earlier will continue to work with all uPort Mobile clients until the uPort Mobile clients with DID support are released in August (exact date listed once known).
* Once the new uPort Mobile clients are released, these clients will only work with versions 0.7.5 and later minor versions of uport-connect.
* 0.7.5 and later minor versions will remain backwards compatible, working with both current uPort Mobile clients and future releases.

## Uport Credentials (formerly Uport JS)

#### What's new in 1.0?

With the release of uPort Credentials `v1.0.0`, there are a number of changes to our API -- the main differences to watch out for are described in this document, and the full API reference can be found [here](https://developer.uport.me/uport-js/reference/index).  The primary changes consist of function name changes, with the hope of improving clarity.  We have also clarified the role of this library as the primary method for *creating* and *verifying* messages in the form of verifiable claims, all of which are described in the [uPort specs repo](https://github.com/uport-project/specs).

#### New static method `createIdentity`
With the new identity architecture used in this release, it is now possible to create a uPort identity without any on-chain interactions.  This static method creates a new keypair of a `did` and `privateKey`, which are all that are necessary to create a new identity.  A new `Credentials` object can then be instantiated with a brand new identity as follows:
```javascript
const {did, privateKey} = Credentials.createIdentity()
const credentials = new Credentials({did, privateKey})
```

#### `createRequest` -> `createDisclosureRequest`
This is a simple name change to clarify the fact this creates a request as part of a selective disclosure flow.

#### New method `createDisclosureResponse`
To better support two-way communication between all types of uPort clients, it is now possible to create a disclosure *response* as well as a request from `uport-credentials`.  This is the response part of the selective disclosure flow, and is equivalent to what gets returned by the mobile app when a disclosure is approved.

#### `createVerificationRequest` -> `createVerificationSignatureRequest`
Another name change to clarify that this request asks for a *signature* from a user, on the provided `unsignedClaim`.  

#### `receive`, `authenticate` -> `authenticateDisclosureResponse`
The `receive` method has been removed, and the equivalent `authenticate` method has been renamed to reflect that it is verifying the response to a selective disclosure request, *as well as* the fact that the original request came from the verifying identity (i.e. the current `Credentials` instance).  This makes the selective disclosure flow suitable for user authentication.

#### New method `verifyDisclosure`
This is a new function to verify a JWT that is not necessarily part of a selective disclosure request (e.g. a JWT that is part of a public profile, or given from a third party).  It differs from `authenticateDisclsoureResponse` in that it does not verify an authentication challenge, so doesn't confirm that the request originated from this identity.  Instead it just verifies the data and signer of the claim, and returns the verified object.

#### `attest` -> `createVerification`
We have renamed `attest` to better clarify that the return value of the attestation creation method is a JWT, and that it does no sending of the attestation/verification on its own.  In addition, we have adopted the language `verification` to refer to the most general sense of `attestation`, `claim`, and `credential`, as the language often can get confusing.

#### New method `createTxRequest`
This is a request for a user to make an ethereum transaction.  It provides the signature and address of the contract inside a signed JWT, allowing the recipient to verify the identity requesting that they make the transaction, and have the parameters and contract address pre-filled.

#### `lookup` -> **removed**
As the primary method for identity creation and management has changed, we no longer need to look up identities in a uport-specific contract.  Instead, `DID`s are resolved with the appropriate `did-resolver`, which handles any lookup/document retrieval necessary for a particular DID. 

#### `credentials.push` -> **removed**
Push functionality is now handled by the new [`uport-transports`](https://github.com/uport-project/uport-transports) library.  Additionally, when using `uport-connect`, a `Connect` instance will make requests using push automatically if given permission from a mobile app.


### *What's New in Version uport@0.6.5 (minor release)*

* Backward compatible Ethr-DID response support that allows communication with IDs created with the ethr-did registry in the upcoming uPort mobile client release.
* Use the networkAddress key/value received in responses for all blockchain interactions if you have not already switched from using the address key/value. A networkAddress will continue to be a MNID encoded address for the network your app is configured for. It you are using the uPort subProvider this already happens by default. Continue to use the address key/value as you have for all other interactions (i.e as the subject for attestations issued). In the transition to DIDs the address key/value in a response may be a DID or MNID, but the libraries will set this appropriately to support both new and old mobile app identities.


##### *Steps to migrate*

* npm install uport
* Use networkAddress key/value in response for all blockchain interactions instead of address key/value if you have not switched already. Continue to use address key/value for all other interactions (i.e attestations). This change may not be required, its dependent on your current implementation.

##### *Legacy support*

* Versions _[version 0.6.2](https://github.com/uport-project/uport-js/tree/v0.6.2)_ and earlier will continue to work with all uPort Mobile clients until the uPort Mobile clients with DID support are released in August (exact date listed once known).
* Once the new uPort Mobile clients are released, these clients will only work with versions 0.6.3 and later minor versions of uport-connect.
* 0.6.3 and later minor versions will remain backwards compatible, working with both current uPort Mobile clients and future releases.

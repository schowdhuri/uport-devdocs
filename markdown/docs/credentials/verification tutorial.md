---
title: "Server-side examples"
index: 2
category: "uport-credentials"
type: "tutorial"
source: "https://github.com/uport-project/uport-credentials/blob/develop/docs/guides/tutorial.md"
---


# Issuing and Requesting Server-Side Verifications

In this tutorial, we will demonstrate:

* How in the **Creator** process, you can create and sign a custom credential on a server for your users
* How in the **Requester** process, you can request a credential and validate the corresponding JSON Web Token (JWT)

The Creator process provides the owner of the uPort identity with a new credential to add to their list of credentials. The Requester process allows an app to request that credential from them when the need arises. 

For more information on this tutorial and the code, please visit the [uport-credentials repo](https://github.com/uport-project/uport-credentials).

To get started, download the repo, run install, run build, and finally access the code for this tutorial in the **examples** folder:

``` bash
$ git clone https://github.com/uport-project/uport-credentials.git
$ cd uport-credentials
$ npm install
$ npm run build
$ cd examples
```

After completing the steps above, run the **Credential Creator Service** and open the URL in the terminal console output, this will request your DID (identifier) with a QR code on the browser. Once it receives a response, it will issue a credential to that DID and send it through a push notification. The output will be available in the terminal console.

``` bash
$ node createcredential.js
```

Once you have the credential in your uPort client, you can use the **Credential Requestor Service** by running and opening the URL in the terminal console output. You will be prompted to share the credential you just received, upon receiving the credential, it will verify it. The output will be available in the terminal console.

``` bash
$ node requestcredential.js
```

## Create an Identity

This tutorial uses sample application identities (private keys) to issue and verify credentials on a server. For your own applications, you should create a new private key with this library using the code snippet below:

```
$ node
> const { Credentials } = require('uport-credentials')
> Credentials.createIdentity()
{
  did: 'did:ethr:0x123...',
  privateKey: '3402abe3d...'
}
```

**Note**: in practice the signing key for the identity should remain private.

## Create a Verification Service

The `createcredential.js` file contains a simple node `express` server. In the setup phase, we will use the private key and DID we created above. You might notice that we already have an example key pair available in the file, but this should be **replaced** with your own key pair for any real application.

The first step for this process is to create a `Credentials` object which encapsulates our newly generated key pair.

```js
var credentials = new uport.Credentials({
  did: 'did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840',
  privateKey: '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3'
})
```

This `Credentials` object can create messages *containing* or *requesting* verified data. At the default route, we have a handler set up with `app.get('/')`, which simply calls the `createDisclosureRequest()` method on our new credentials object. The disclosure request is a JWT, signed by our newly created identity, that requests specific information from the user. More specifically, we request the ability to send push notifications to the user by including the `notifications: true` key-value pair. When a user receives a request on their mobile app, they are asked to approve the disclosure of the requested attributes and their Decentralized Identifier or `DID`.

To get this request to the user's mobile app, we can use a number of "transports" provided by the `uport-transports` library. The details of all the available transports are outside the scope of this tutorial, but there are helpers available for using QR codes, push notifications, mobile-specific URLs, custom messaging servers, and others. In this tutorial, we present the request to the user in the form of a QR code, using `transports.ui.getImageDataURI`, after converting the JWT into a request URI. The QR code is displayed on the page that is viewed by the user.

_**Note:** There are several forms of transports to consider. This tutorial focuses on the practical side of requesting and exchanging credentials. For more information on transports, please visit the [Transports repository](https://github.com/uport-project/uport-transports). For your convenience, we have also built another library, called [`uport-connect`](https://github.com/uport-project/uport-connect), which comes with multiple preconfigured transports._

Once you scan the QR code with your mobile app, you will receive an alert informing you that you are about to add a credential. The page will also contain a clickable link which will open the uPort mobile app from a mobile browser.

Note that in the disclosure request above, we set the `callbackUrl` field to `/callback`. This is the route to which we should navigate when the response is received from the mobile app. When we hit that route the `app.post('/callback')` handler will call `credentials.createVerification()` to sign a verification in line `57`.  
```javascript
credentials.createVerification({
  sub: did, // did of the current user
  exp: Time30Days(), // calculate the timestamp for 30 days from now
  claim: {'My Title' : {'KeyOne' : 'ValueOne', 'KeyTwo' : 'Value2', 'Last Key' : 'Last Value'} }
  // Note: the example above is a complex claim. You could use a simpler claim such as:
  // claim: {'Key' : 'Value'}
})
```
The verification requires three fields: `sub`, which identifies the *subject* of the claim; `exp`, which is the Unix epoch timestamp, in seconds, in which the claim should no longer be considered valid; and `claim`, which contains the data being signed. The claim can be any serializable JavaScript object (e.g., JSON), so feel free to edit the keys and values of the claim to anything you would like to issue to your users. You might have also noticed that we set the `sub` field of the claim to the `DID` of the user — a piece of information that is disclosed to us when they scan the QR code with the uPort mobile app.

The `createVerification()` function returns a promise that resolves to a JWT. This time, we will make use of another transport from the `uport-transports` library (specifically, `transports.push.send`) to send the JWT as a push notification, without requiring the user to scan another QR code. This transport requires a public encryption key and a push token of the user to whom it’s being sent to — both of which are included in the initial disclosure response.

When the `/callback` page loads, a push notification should appear in the mobile app of the user who has just scanned the QR code, containing the credential that you have edited above.

After performing any edits, you can test this flow by starting the server with:
```bash
$ node createcredential.js
```

Open the URL output in your browser and scan the QR code. This will initiate the disclosure request, a process that will result in the creation and delivery of a new verification. To uncover the format of the JWTs being passed around, look for the output in the terminal.

## Request Verification Service

The `requestcredential.js` file contains a simple node `express` server which will request the same credential that the Creator service gave out. The Requestor server will then validate that the credential is coming from the same identity that received it from the Creator service.

As with the Creator service, we start by setting up the `Credentials` object using the private key and DID we created above (or using the example provided). We also set up `bodyParser` so that we can parse the JWT that we receive from the user.

When we load the app at the default route, our handler `app.get('/')` will call `createDisclosureRequest()` much like before, but this time we will request a specific credential from the user. In a disclosure request, the `verified` key to denotes a list of credentials that we are requesting -- we are currently requesting that the user disclose a verification with the primary key `'My Title'` -- changing the keys in this array will request different pieces of data from the user, and they will be prompted to approve all verifications that you request. If you changed the primary key of the credential that you issue in the `createcredentials.js` service, remember to change the name of the key in the `verified` array.

Once again, we use the `callbackUrl` field to specify where we should handle the response from the user, assuming they agree to share it. This must be a publicly available endpoint so that the uPort client can post the response to it. Here as above, the example servers are wrapped with [ngrok](https://ngrok.com/) to create a publicly available endpoint on demand from a server running on `localhost`.

To interact with this service, run:

```bash
$ node requestcredential.js
```

Then open your browser to the URL output in the console. You will see the QR code with the request, scan that code with the uPort app. Look for the output and responses in the terminal console again.

When the mobile app user approves the request to share their credential after scanning the code, the `/callback` route is called using `app.post('/callback')`. Here, we fetch the response JWT using `req.body.access_token`.

Once we have the JWT, the next step is to validate it. We use the `authenticateDisclosureResponse()` function first. This validates the JWT by checking that the signature matches the public key of the issuer. This validation is done both for the overall JWT and for the JWTs that are sent in the larger payload. You may also want to verify additional data in the payload specific to your use case.

If everything checks out, you will see the following output in the console:

```js
Credential verified.
```
Congratulations, you have verified the credential!

To test everything, try checking for a different attestation and make sure it fails. We also recommend waiting until the request expires to confirm that the response fails &mdash at which point you’ll witness an error message.

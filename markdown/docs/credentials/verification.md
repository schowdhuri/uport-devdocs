---
title: "verification"
index: 1
category: "attestation"
type: "orientation"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/credentials/verification.md"
---
# Issue Server-Side Verifications

## Help Users in Building a Digital Identity

* Cryptographically sign user data on behalf of your application
* Send verifications as a JWT to your users via a QR, push, or another transport

By presenting a verification to a user, you are cryptographically signing a claim about that user, and as a result, attesting to the truth of a peice of information about them. Anyone who has access to your application's DID can then confirm that a specific verification for an identity came from your dApp. 

Attesting to information about your users will enable them to build up their digital identity and add real value to your dApp. For example, if your dApp is a social platform that requests and verifies a user’s phone number and email address during onboarding, then that user can receive a verification that they are not a bot. This allows them to have a frictionless “proof of being a human” verification across the decentralized web.  

To implement this solution, you’ll have to clone the uPort Credentials and uPort Transports repositories locally.

uPort Credentials simplifies the process of identity creation within JavaScript applications. Additionally, it allows apps to sign and verify data. These pieces of data take the form of signed JSON Web Tokens (JWTs), they have specific fields designed for use with uPort clients, collectively referred to as verifications.

To allow for maximum flexibility, uPort Credential’s only deals with creation and validation of verifications. To pass verifications between a JavaScript application and a user via the uPort mobile app, we have developed the uPort Transports library, use it in conjunction with uPort Credentials when necessary.

If you plan on using uPort Credentials + uPort Transports for your solution, then this tutorial is written for you. To integrate this solution into your dApp, you’ll need to:

* Clone the [uPort Credentials](https://github.com/uport-project/uport-credentials) repository locally
* Clone the [uPort Transports](https://github.com/uport-project/uport-transports) repository locally
* Download the uPort Mobile app ([Android](https://play.google.com/store/apps/details?id=com.uportMobile&hl=en_US) | [iOS](https://itunes.apple.com/us/app/uport-id/id1123434510?mt=8))

We’ll cover these steps and more in the next section.

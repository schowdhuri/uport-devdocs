---
title: "login"
index: 0
category: "login"
type: "orientation"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/credentials/index.md"
---

# Server-side Login Solution
## The Login Solution for Your Server-side dApp

* Login a user
* Keep a user logged in
* Join a network of dApps that allow Single Sign-On through SSI
* Create your own tranport solution 

To implement this solution, you’ll have to clone the uPort Credentials and uPort Transports repositories locally.

uPort Credentials simplifies the process of identity creation within JavaScript applications. Additionally, it allows apps to sign and verify data. These pieces of data take the form of signed JSON Web Tokens (JWTs), they have specific fields designed for use with uPort clients, collectively referred to as verifications.

To allow for maximum flexibility, uPort Credential’s only deals with creation and validation of verifications. To pass verifications between a JavaScript application and a user via the uPort mobile app, we have developed the uPort Transports library, use it in conjunction with uPort Credentials when necessary.

If you plan on using uPort Credentials + uPort Transports for your solution, then this tutorial is written for you. To integrate this solution into your dApp, you’ll need to:

Clone the [uPort Credentials](https://github.com/uport-project/uport-credentials) repository locally
Clone the [uPort Transports](https://github.com/uport-project/uport-transports) repository locally
Download the uPort Mobile app ([Android](https://github.com/uport-project/uport-transports) | [iOS](https://itunes.apple.com/us/app/uport-id/id1123434510?mt=8))

We’ll cover these steps and more in the next section.

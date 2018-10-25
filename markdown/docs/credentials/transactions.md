# Requesting Transactions
## Send Users An Ethereum Transaction Request for Your Server-Side dApp

In this tutorial, we will demonstrate how you can create and send an Ethereum transaction request to your users, using the uPort Credentials and uPort Transports libraries.

uPort Credentials simplifies the process of identity creation within JavaScript applications. Additionally, it allows apps to sign and verify data. These pieces of data take the form of signed JSON Web Tokens (JWTs) which have specific fields designed for use with uPort clients, collectively referred to as verifications.

To allow for maximum flexibility, uPort Credential’s only deals with creation and validation of verifications. To pass verifications between a JavaScript application and a user via the uPort mobile app, we have developed the uPort Transports library. Use it in conjunction with uPort Credentials when necessary.

If you plan on using uPort Credentials + uPort Transports for your solution, then this tutorial is written for you. To integrate this solution into your dApp, you’ll need to:

* Clone the [uPort Credentials](https://github.com/uport-project/uport-credentials) repository locally
* Clone the [uPort Transports](https://github.com/uport-project/uport-transports) repository locally
* Download the uPort Mobile app ([Android](https://play.google.com/store/apps/details?id=com.uportMobile&hl=en_US) | [iOS](https://itunes.apple.com/us/app/uport-id/id1123434510?mt=8))

We'll cover these and more in the next section.

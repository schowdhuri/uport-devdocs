---
title: "Getting Started"
index: 0
category: "overview"
type: "guide"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/guides/GettingStarted.md"
---

# Getting Started

Welcome! The goal of this guide is to get you set up quickly with a skeleton project and to familiarize you with a few basic concepts.  If you have any questions or difficulties, head over to [Riot](chat.uport.me) and someone will help you out.

## Get the uPort App

The primary way this app interacts with applications is by scanning QR codes during transactions like disclosing data, verifying previously disclosed information or sharing contacts for example.

Install the latest mobile client for your smartphone: [uPort iOS](https://itunes.apple.com/us/app/uport-identity-wallet-ethereum/id1123434510?mt=8) | [uPort Android](https://play.google.com/store/apps/details?id=com.uportMobile)

## Get an Application ID

Head over to [MyApps](/myapps) to register an application identity.  Once authenticated to [MyApps](/myapps) proceed to click on **Register an App** and you will be guided through the process of creating and saving an application identity.

During this process you will receive a verification on your uPort mobile app which you will need to accept in order to complete the registration steps.

Application Identities are tied to your Ethereum identity that you created with the uPort mobile app.  They are stored as a verification and their configuration can be viewed from your mobile device by clicking on the verification to inspect it.

## Buidl

From here, the world is your oyster! If you are looking to build **client-side** solutions here are a few jumping points:

- [Uport Connect](/uport-connect/guides/usage) (web)
- [Using uPort with Truffle Box](/reactuporttruffle) (web)
- [react-native-uport-connect](https://github.com/uport-project/react-native-uport-connect) (mobile)

For **server-side** solutions where you need to keep signing keys secure:

- [Uport Credentials](https://github.com/uport-project/uport-js) 
- [Uport Transports](/transports/index)
- [Sign off-chain Messages](/messages/index)
- [Sign on-chain Transactions](/flows/tx)

That's it!  Please check out our other guides and tutorials for more examples of how you can expand this code to do other things, like [Signing Transactions](https://developer.uport.me/signtransactions), or [Attesting Credentials](https://developer.uport.me/attestcredentials).

As always, if you have any questions or issues getting started please reach out to us on [Riot](chat.uport.me) or open an issue on [Github](https://github.com/uport-project).

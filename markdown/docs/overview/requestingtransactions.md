---
title: "Requesting Transactions"
index: 5
category: "Requesting Transactions"
type: "orientation"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/overview/requestingtransactions.md"
---
# Requesting Transactions
## Send User’s An Ethereum Transaction Request

* Send an Ethereum transaction request to your users
* Receive a transaction hash from your user’s app
* Receive a transaction confirmation from the Ethereum Blockchain

Each time you interact with the Ethereum Blockchain, you’re updating its state by executing one of the following transactions:

1. Transfer of Ether from one party to another

1. Creation of a smart contract

1. Transacting with a smart contract

The third transaction type is what we’re primarily exploring in this section. 

uPort allows you to send a request to your users, asking them to sign an Ethereum transaction. Your dApp creates the Ethereum Transaction before sending it to a user's uPort mobile app through the Ethereum Transaction Request Flow.

Our tutorials have been tailored based on the type of solution you seek. The following are the two main categories:

* Server-side dApp
  * If you’re building a server-side app using uPort Credential + uPorts Transports, then this is the appropriate solution for you.
* Web3 dApp
  * If you’re building your app using uPort Connect; the default, quick start implementation to integrate with uPort, then this is the appropriate solution for you.


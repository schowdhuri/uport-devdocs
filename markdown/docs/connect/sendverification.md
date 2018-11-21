---
title: "Send Verification Example"
index: 3
category: "uport-connect"
type: "tutorial"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/connect/sendverification.md"
---

# Introduction

Much like logging in, using uport-connect to create and send verifications to uPort mobile clients is simple.  Our connect library will manage much of the flow for you with minimal configuration.

![sendverification](https://plantuml-server.kkeisuke.app/svg/UDg5LTzlsa0CVjzVOQLxs1wgjjBQ0aAe_4ZMJNHYRQKzZ4azBWPEJUuotwLbg_g_pvSG255XFA3psVw-ppuRhgmJvF8qUGSWScTqdiwGsB2FIcU2H0faSXrBGne9pavtN0EpceWuLdhHz2nHn4YHqMve4aDmTD4-Ruy6UsBkr5-4izQETyZtP9A18GvQWtmQjiF-nKxOD-FmVp4MV-Ue9S8BNmFqYSnpCnhWCnUQ3OHyN1GLDtLN0NMkS1GEesZhl6vMFIy-HG3twcsTfQl9Esg5xA_SjIuNLnD-D2LL9hJR1reFQOBNPDN2cYHzwGpjWo-T1u13xPJxiozzxJsGFn9Ep8J5VGWR_m6CiPhZMEcz6A_yFJCh2EwGdf02DhDjFo389uOSUAUIQ0CGbcUfDE3eCheCetDEGHrx53x9ScOXkBw_dy0NxP24TChe8lKPPpLr1UymKQYTvnM-dt1ZPYh1BIRmqQST_powR9-tHgrVlSBkm91GE0G1iR8oCJOd1F9pRjrK2ywswFAC_IbQAnRyhbCjbq9hJ63EJ9b94hvaVCqR18RBBmL6Wt0KdJB3rn_tB4EQ66ElNi3tMvZg1VBl03F7W48kfxnXYmrn9VQujsrJ1sR8x1KVG5chUlBgEPhDikWYhQpDIg6PRTUrFdP0P1cnt1ffBQh6UuisCzm8PxOzO2DJya3HOsKTQkkJYb3WdI3EBdf61Q95c9D98QtUwesQ2HqfB4Jkf1GwSACYnaOhrb1ctOZ4iEWtHc3JYseAk4nbROx05Qcvai8F7LHrabeiNQt88EXAlmkTQeXxNTMJYL1f1rw2S2NIBC40l34MrYy0Qcy-l7_H-Emt3pzyV7ruxPweNlUaWEe5GUqXDb9NMwdzzREL2db-967Cmwz4OdaghdZY-M_e7pUT7eK0.svg)

This solution guide utilizes the disclosure request and response flows, as well as the 

- [Selective Disclosure flow](/flows/selectivedisclosure)
- [Selective Disclosure Request](/messages/sharereq)
- [Selective Disclosure Response](/messages/shareresp)
- [Send Verification Flow](/flows/verification)
- [Verified Claim Request](/messages/verificationreq)

## Setup

In addition to the above concepts and uport-connect, also note the following requirements before starting this example:

- NodeJS
- Create a folder for the example and `cd ./example && npm init` 
- Install dependencies `npm install --save ngrok express path`

### Boilerplate

First, require and configure dependencies.  Compared to our server solutions there is much less boilerplate.  This is because uPort connect can be utilized from a static page, and in this example we will be using express to serve a static html file to showcase that point.

Take the following boilerplate and save it in the root of your project.  We'll assume this file is named *server.js* for reference purposes.

```js
const express = require('express');
const ngrok = require('ngrok');
const path = require('path');

//setup boilerplate
let endpoint = ''
const app = express();

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));  //serve static html 
});

// run the app server and tunneling service
const server = app.listen(8088, () => {
  ngrok.connect(8088).then(ngrokUrl => {
    endpoint = ngrokUrl
    console.log(`Your dApp is being served!, open at ${endpoint} and scan the QR to login!`)
  })
})
```

## Create and Send a Verification

With the boilerplate out of the way, it is now time to configure a uport-connect object to authenticate a user and send a verification.  It's necessary to repeat the steps we showed in the login solution example because we need to request an address to send the verification to.

Create a file named `index.html` and add the following markup/code as the contents.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <!-- Load connect from CDN -->
    <script src="https://unpkg.com/uport-connect/dist/uport-connect.js"></script>
  </head>
  <body>
    <div id="msg">
      Give the module a second to load...
    </div>
    <script type="text/javascript">
     const Connect = window.uportconnect
     const uport = new Connect('MyDApp')

     const reqID = 'disclosureReq'

     uport.requestDisclosure()

     uport.onResponse('disclosureReq').then(res => {
       json = JSON.stringify(res.payload)
       console.log(json)
       document.querySelector('#msg').innerHTML = "Congratulations you are now `logged in`.  Here is your DID identifier:  " + json
     })

     uport.sendVerification({exp: Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60,
                             claim: {'Example' : {'Last Seen' : `${new Date()}`}}
     })
    </script>
  </body>
</html>
```

After authenticating the user with the response from the disclosure request, a verification can be sent to the authenticated identity.  In this case, we are sending a verification of when we interacted with a particular identity.  Later on this information can be requested by the name of the claim, which is "Example".

When interacting with the dApp code above, it is recommended you open your browsers developer tools to inspect the console and network traffic for additional insight.

## Run the example

To serve your dApp as a static html file run the boilerplate code and you should see a message in the terminal like 'Your dApp is being served!, open at https://49013ce0.ngrok.io'.  Alternatively you may just open the file in a browser.

Now let's combine everything together to try it out!

- Open a terminal and run server.js `node server.js`
- Open a browser and navigate to the ngrok URL displayed in the terminal
- Eventually scan the QR with the uPort mobile client once it loads
- Approve (or deny) the disclosure request
- Accept the verified information
- Watch your browsers network activity




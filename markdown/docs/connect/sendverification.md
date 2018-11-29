---
title: "Send Verification Example"
index: 3
category: "uport-connect"
type: "tutorial"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/connect/sendverification.md"
---

# Introduction

Much like logging in, using uport-connect to create and send verifications to uPort mobile clients is simple.  Our connect library will manage much of the flow for you with minimal configuration.

![sendverification](https://plantuml-server.kkeisuke.app/svg/UDfzLS5ksp0ClVih27U7xL1q7PQc2OAWiUEi6x8XQmlii0oe8ZEfK5do9BdDLlJVHzcEwnJEVB94yl4zyXc-i8uPLsGoO8NJgiXMQ09xBrJE3Cl0w4AbN1k51axVjmAHtYvOcWgrsR-_GvQYcMdbOYsrWQEpGMymZJephiLVXDFpLYocMwDbf0sbr00Vuq4oEMibVTCE_vzXyNU1YYCy1HDZzED-tYSIbKUCtszATViygs0RFPacyMnM1IvVgrkNJq3Jw6Bahr_tcPud50lsvnSiQ0c2YvmfrmNK3hy6h2cqKjh04-wqwOAi0WV04kM4-zDLLaSEr4sPOojcEzVJn0xKpiKQvq9rrZu7Axs5y1hD0vemo5-qGbWij77WGuAZ3O5PsdzrQEfHfK080Q_y1U7bpSq2FYk7Xd4dj2hB7d55wvvDui67gbyi1IeN1ipF2hxgbP2umuB0fnyVZyko8SG6cKDWa0hBfRQ5GJ3UXzOj5QCQYwx8APwXjMn3-ragViUKGWbhGi-rb7GPA78tQ99PqQdiGlXVVjm0ULgdc7gk3BvVmL9jaBvCwfi2Cdwt9FzlchODmMOSGrWXTTxr0l3An8FdNJQRzU8eYe9AQ4kRvKnHltQWVXq2otD3T9kchPnMtokqkQOXEFsYdmwvu0S5puLrgAmlAHE1N6sejfoMAV4imjhe3B9gCnrw3JeZiAItLr1om9f1Ykqnx61qBLvg8bjT_ZnA-lsar_lLqh_REuaJrXO8f4Ii1MVULb2faxXsBMLXEEBUtaCuwi_woQmt7eanbqnaGtWAaotBSeaX-CESMUzjLFvu--P9uIFGXuHltptVFezEn7XqKaADmx2PVCDo-y9oKc-f8aTsuGPJyhPWqf8DBiZKz0_u1o4t39q0.svg)

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




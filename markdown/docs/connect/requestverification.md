---
title: "Request Verification Example"
index: 4
category: "uport-connect"
type: "tutorial"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/connect/requestverification.md"
---

# Introduction

Much like logging in, using uport-connect to request verified data about uPort mobile clients is simple.  So simple we will follow the same steps of logging in, but this time pass an array of verification titles that we want to request for disclosure.  Our connect library manages the flow for you with minimal configuration.

![requestverification](https://plantuml-server.kkeisuke.app/svg/UDg5LKrpsZ0GlUTNx3YNzf2cwPGI68O96DEqatR8nqmF8OUrl80cjkHASaAQoN_loiPWQ4WvC9BUxjlLUoiuimwDAxBq000BfrMHnMHuO--boj5W1aONAX7QA39myd4B6khb19D4glakiY1Co8orSg5EjO73BvrMPpJS4tCj_n2Sd6wX8PyRdGwruQ0LoUUm4ms-R8Nzr8x-5sFfTq5A43ppCS306Fsu6mtmbI-Q3r7SpyiRx_PT1pHhHQCe78ytuFdkhMVbfmnWhLxliu9swuvE8yPhkA5oUJHXqwIGEIgtZxGPialUQAiHjbja89ms--Why0tYI3dfdlQbhz0tyaVeC4PB-nZM-1iS5t965rBjvNZXxrWl8RWcyq0cu6s-qGE2OgAD0mzAGJO0j3nBrQR1GohnBBmIrSn2S7vpCu5lof51uQHMPUeZnJmouq7O-LJN3LD9olcwwFM47pgMAMquWPS-xUZsC6gterRhhb_kkn0QGaU0a4WhKcqBGs3yd5itLSZPbboHCvwHjJXdNwTAB50fIc76bNATfdp8_8fV4AGqS_NGCVi4hGLKWCRW4-WPi3fo9WLA_ea0jYvb1IIl5jHimEcfMZK1DYVXKq2aA3D8s2w8dwhSxbHDLH3qX7Ua2uVjSJiQj_ezsIzoLlp3YcEqPdxtN3L0IHTkWsY9MPvISFVoldSi-xtZagSV19xscWNrQYDy_tN3EWgTK58TN5u1eLYmn_ErM7uCQf6F-Xjxkn0JgrRhL0PvBn-ywgMJurOu7FfVXigqChtonWgMxl9g6rejku1vRlJ3ke7jg4RzAxAvPYETtdZ8croAsZHcCLKlQ-Ckf7Mah4ygGu7VjE7iqdDJCbg2cT4PPFMilN9tGyv8AflSIYdxe7KN2JKb-MTMboizKksLxCLzdilUSTndLa6IsOMXXEsIc4wLLDnYXlwry5YXWqVsRAKH9GTd_2BuR-el2j8nQG00.svg)

This solution guide utilizes the disclosure request and response flows, as well as the verified claim request.

- [Selective Disclosure flow](/flows/selectivedisclosure)
- [Selective Disclosure Request](/messages/sharereq)
- [Selective Disclosure Response](/messages/shareresp)
- [Verified Claim Request](/messages/verificationreq)

## Setup

In addition to the above concepts and uport-connect, also note the following requirements before starting this example:

- NodeJS
- Create a folder for the example and `cd ./example && npm init` 
- Install dependencies `npm install --save ngrok express path`

### Boilerplate

Take the following boilerplate and save it in the root of your project.  We'll assume this file is named *server.js* for reference purposes.  The code below configures an express server to serve our static html file *index.html* that will be created in the next section.

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

## Request Verifications

With the boilerplate out of the way, it is now time to configure a uport-connect object to authenticate a user and request a verification.  A verification is data that has been attested and the next order of business will be to request a piece of attested information.

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
     //////////////////////////////
     //  Configure connect object
     /////////////////////////////

     const Connect = window.uportconnect
     const uport = new Connect('MyDApp')

     const reqID = 'disclosureReq'

     uport.requestDisclosure(
       {verified: ['Example']}
     )

     uport.onResponse('disclosureReq').then(res => {
       json = JSON.stringify(res.payload)
       console.log(json)
       document.querySelector('#msg').innerHTML = "Congratulations you are now `logged in`.  Here is the response:  " + json
     })
    </script>
  </body>
</html>

```
In the previous solution guide for creating verifications there was some mention of being able to request those verifications at a later time.  The code above performs this request by passing a "request object" that contains a key `verified:` with an array of verification title's as it's value.  Each string in the array is meant to match 1:1 with the name of a verification held by a uPort identity.

This example differs from our login solution guide slightly in that when "logging in" we are also requesting an array of claim titles.  If any of the claim titles match a verification the user has, that the mobile user can choose to disclose that piece of information to the requester.

When interacting with the dApp code above, it is recommended you open your browsers developer tools to inspect the console and network traffic for additional insight.

## Run the example

To serve your dApp as a static html file run the boilerplate code and you should see a message in the terminal like 'Your dApp is being served!, open at https://49013ce0.ngrok.io'.  Alternatively you may just open the file in a browser.

Now let's combine everything together to try it out!

- Open a terminal and run server.js `node server.js`
- Open a browser and navigate to the ngrok URL displayed in the terminal
- Eventually scan the QR with the uPort mobile client once it loads
- Approve (or deny) the disclosure request
- Watch your browsers network activity


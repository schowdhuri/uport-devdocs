---
title: "Web3 Login Example"
index: 2
category: "uport-connect"
type: "tutorial"
source: "https://github.com/uport-project/uport-project.github.io/blob/develop/markdown/docs/connect/login.md"
---

# Introduction

Using uport-connect to create a login solution is easy!  Instead of creating your own solution using uPort Credentials + uPort Transports, you can use uport-connect which does most of the work for you.

![login flow](https://plantuml-server.kkeisuke.app/svg/UDg5LCjksp0GlFSh5lOvG0BKyUCGnDQZQU4MRcAWXxe7YbhRH2HINLA9swB_tXNbXon4hWy6bxCxCxiaTM-T85VcsJi0KJgZopn1ui0-Arq84ZcGANKg3MaakBa-WsPcjn1fglIcZMnHf4YnqIumcI7etuu7ut3MaVEaVYFSZCxGWFV9P3D3dBGdUH-Ce-djMTeNu_1_EHP_bgWbmX_U1fWIcTTsDi07RhIO2VcyyHstVHyIcbfH60LnV08Vsbsl_SydyApUzbb3RTrm535-W1jJzbiBFZGbLI6qwo9jfhJ96xOQQMsHgNI6kkXhy09nf9rolxhAz-Y5-b0uaGYBNGn7_0B7NArnhdGdnr_-JymEUaz8BqWz3elJFA1NBWmvg40bqVP0MBvBTG3zOJoCuW6Ne4uh5bx9-iv2xs6vNC17xP24TCfeN_gAISETrmqoXTfLkgAQ9tmsYShmn0cyhCgkllU7uy4e7Fsuy_440aBX40IaoihCs98GgBhdrgsqu6gBhYmOpz5QiU5pNMcv5LfZ1cjMAaoMyIRpQtv1OBZzsc0yYyBucXK-VLko3MbIJ2lt0hu-maflaBy3h9m22hbTyGlR78KFPg_kJcEQG8AiVj03g7jLBvLxpkQmRjgNrRrPAJIhdKFxvGH4KH3RROWsiXgwZsWBmuDmvZG33WebBpGzLzQXjbMHJmL-4yJLVcRa6It2camE-U6itkYPq952R_AinFl0euiKMwDedVLkFv3CL2Da_9xl1N-i_m79TDdq.svg)

This solution guide utilizes the disclosure request and response message format along with the selective disclosure flow.

- [Selective Disclosure flow](/flows/selectivedisclosure)
- [Selective Disclosure Request](/messages/sharereq)
- [Selective Disclosure Response](/messages/shareresp)

## Setup

In addition to the above concepts and uport-connect, also note the following requirements before starting this example:

- NodeJS
- Create a folder for the example and `cd ./example && npm init` 
- Install dependencies `npm install --save ngrok express path`

### Boilerplate

Compared to our [server solutions](/server) there is much less boilerplate.  This is because uPort connect can be utilized from a static page, and in this example we will be using express to serve a static html file to showcase that point.

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

## Create Authentication Functionality

Now for the fun part!  Let's create our simple dApp with login capabilities using uport-connect.  Create a file named `index.html` and add the following markup/code as the contents.

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
    <script type="text/javascript">Setup a connect object
     const Connect = window.uportconnect
     const uport = new Connect('MyDApp')
     //Ask the user for their address information by using default disclosure behavior.
     uport.requestDisclosure()

     uport.onResponse('disclosureReq').then(res => {
       const did = res.payload.did
       json = JSON.stringify(res.payload)
       console.log(json)
       document.querySelector('#msg').innerHTML = "Congratulations you are now <b>logged in</b>`.  Here is your DID identifier:  " + json
     })
     
    </script>
  </body>
</html>
```

Here we utilized the default `requestDisclosure()` behavior, but we could have requested [additional information](https://github.com/uport-project/uport-connect/blob/develop/docs/reference/index.md#connectrequestdisclosurereqobj-id-sendopts) to be disclosed.  We can also set a callback URL in the scenario where there is a server-side component that needs the response.

If you want to try that out, start by modifying the `requestDisclosure` call in the source of the *index.html* to resemble the following:

```js
uport.requestDisclosure({ requested: ['name'],
                          notifications: true })
```
This will request the mobile user's name, and ask for permissions to send push notifications for future requests.

When interacting with the dApp code above, it is recommended you open your browsers developer tools to inspect the console and network traffic for additional insight.

## Run the example

To serve your dApp as a static html file run the boilerplate code provided above and you should see a message in the terminal like 'Your dApp is being served!, open at https://49013ce0.ngrok.io'.  Alternatively you may just open the file in a browser.

We hope this solution for how to "login" with an ethereum identity using uport-connect has been helpful.  

All that is left to do is to try it out!

- Open a browser and navigate to the ngrok URL
- Eventually scan the QR with the uPort mobile client once it loads
- Approve (or deny) the disclosure request
- Watch your browsers network activity


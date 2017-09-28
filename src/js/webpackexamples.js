////////////////////
// uPort Setup
////////////////////

const uport = new uportconnect.Connect('uPort Demo', {
  clientId: '0x2bede7ae69a9aa7684c373ae33fb21162e565e52',
  signer: uportconnect.SimpleSigner('d2942f08d12611429c0ab9ea39eeda128253553d356b4c9f9f17f95e141cafc8')
})

const web3 = uport.getWeb3()


////////////////////
// Contract setup BTN
////////////////////

function MyContractSetup () {
  let MyContractABI = web3.eth.contract([
    {
      "constant": false,
      "inputs": [
        {
          "name": "share",
          "type": "uint256"
        }
      ],
      "name": "updateShares",
      "outputs": [],
      "payable": false,
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "addr",
          "type": "address"
        }
      ],
      "name": "getShares",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "type": "function"
    }
  ])
  let MyContractObj = MyContractABI.at("0x71845bbfe5ddfdb919e780febfff5eda62a30fdc")
  return MyContractObj
}

const MyContract = MyContractSetup()

////////////////////
// LOGIN BTN
////////////////////

console.log('TEST')

// Simple button onclick handler
window.loginRequest = () => {

  uport.requestCredentials(
    {
      requested: ['name', 'avatar', 'phone', 'country'],
      notifications: true
    },
    (uri) => {
      
      const qrKJUA = kjua({
        text: uri,
        fill: '#595DC3',
        size: 300,
        back: 'rgba(255,255,255,0)'
      })

      if(window.location.pathname === '/' || 
         window.location.pathname === '/guides' || 
         window.location.pathname === '/guides.html') {

        $$('.kqr').forEach((qr) => {

          let aTag = document.createElement('a')
              aTag.href = uri
              aTag.appendChild(qrKJUA)

          qr.appendChild(aTag)
        })
        
      }
      
    }).then((userProfile) => {
      setUser(userProfile)
      if(window.location.pathname === '/') {
        togglePostLoggedIn_PORTAL_UI()
      }
      if(window.location.pathname === '/guides' || 
         window.location.pathname === '/guides.html') {
        togglePostLoggedIn_GUIDES()
      }
  })
}




////////////////////
// Attest BTN
////////////////////

window.attestationBtn = () => {
  
  console.log('attestationBtn')
  
  if(window.loggedInUser.decodedID){
    
    console.log(
      'window.loggedInUser.decodedID: ' +
      window.loggedInUser.decodedID
    )
  
    uport.attestCredentials({
      sub: window.loggedInUser.decodedID,
      claim: { "Docs Demo": "Unlocked Achievement" },
      exp: new Date().getTime() + 30 * 24 * 60 * 60 * 1000
    })
  
    document.querySelectorAll('.attestMessage')[0].style.display = 'block'; 
  }
}




////////////////////
// Sign BTN
////////////////////

window.signBtn = () => { 
    // Transaction signing (that will fire a QR to scan or card in the mobile app)
    MyContract.updateShares('10', (error, txHash) => {
      if (error) { throw error }
        waitForMined(txHash, { blockNumber: null }, // see next area
        function pendingCB () {
          // Signal to the user you're still waiting
          // for a block confirmation
          document.querySelectorAll('.signMessage')[0].style.display = 'block';
        },
        function successCB (data) {
          // Great Success!
          // Likely you'll call some eventPublisherMethod(txHash, data)
          document.querySelectorAll('.signComplete')[0].style.display = 'block';
          getCurrentDataFromChain(window.loggedInUser.rinkebyID)
          document.querySelectorAll('.updated')[0].style.display = 'inlin{e';
        }
      )
    })
    
    document.querySelectorAll('.signMessage')[0].style.display = 'block'; 
}



////////////////////
// SET USER
////////////////////



function setUser (credentials) {

  window.loggedInUser = credentials
  
  // uPort addresses are a hash of all
  // its different network identities

  // We must grab the explicit address 
  // of the ID to match the network the contract is on!
  
  const decodedId = uportconnect.MNID.decode(window.loggedInUser.address)
  window.loggedInUser.decodedID = decodedId.address
  
  console.log(window.loggedInUser)
  
  // The networks are identified as such
  // Mainnet (network: 0x1)
  // Ropsten (network: 0x3)
  // Rinkeby (network: 0x4)
  // Kovan   (network: 0x42)
  
  console.log("uPort master address: " + window.loggedInUser.address)
  console.log("uPort Rinkeby address: " + window.loggedInUser.decodedID)
}





/////////////////////
// Utilities
/////////////////////


function getCurrentDataFromChain (userID) {
  MyContract.getShares.call(userID, (error, response) => {
    if (error) { throw error }
    console.log(response.c)
    toggleExistingDataLoad(response.c)
  })  
}



////////////////////
// Contract Handling BTN
////////////////////



// Callback handler for whether it was mined or not
const waitForMined = (txHash, response, pendingCB, successCB) => {
  if (response.blockNumber) {
    successCB()
  } else {
    pendingCB()
    pollingLoop(txHash, response, pendingCB, successCB)
  }
}

// Recursive polling to do continuous checks for when the transaction was mined
const pollingLoop = (txHash, response, pendingCB, successCB) => {
  setTimeout(function () {
    web3.eth.getTransaction(txHash, (error, response) => {
      if (error) { throw error }
        if (response === null) {
          response = { blockNumber: null }
        } // Some ETH nodes do not return pending tx
        waitForMined(txHash, response, pendingCB, successCB)
    })
  }, 1000) // check again in one sec.
}


///////////////////////////////////////
///////////////////////////////////////
///////////////////////////////////////

function hideQRs () {
  $$('.kqr').forEach((qr) => qr.style.display = 'none')
}

function userProfileDataInjection () {
  $$('#userProfileData')[0].innerHTML = 
    JSON.stringify(window.loggedInUser, undefined, 2)
}

function avatarSafeInject(domImgElement) {
  if(!(window.loggedInUser.avatar.uri.indexOf('ipfs') !== -1)){
    domImgElement.src = 
      "data:image/png;base64, " + 
      window.loggedInUser.avatar.data
  } else {
    domImgElement.src =
      window.loggedInUser.avatar.uri
  }
}

function injectName () {
    $$('.user-wrap .name')[0].innerHTML = 
    window.loggedInUser.name;
}

function showDataAndUser () {
  show($$('.data-wrap')[0])
  show($$('.user-wrap')[0])
}

function showAttestationArea() {
  show($$('.attestation-area')[0])

}
function showSignTxArea() {
  show($$('.signTx-area')[0])

}



////////////////////
// UIToggles
////////////////////

function togglePostLoggedIn_PORTAL_UI () {
  hideQRs()
  userProfileDataInjection()
  avatarSafeInject($$('.user-wrap .avatar')[0])
  injectName()
  showDataAndUser()
}

function togglePostLoggedIn_GUIDES () {
  hideQRs()
  userProfileDataInjection()
  avatarSafeInject($$('.user-wrap .avatar')[0])
  injectName()
  showDataAndUser()
  showAttestationArea()
  // showSignTxArea()
}

// function togglePostLoggedInUI () {
//   document.querySelectorAll('.signBtn')[0].style.display = 'block'
//   document.querySelectorAll('.loginBtn')[0].style.display = 'none'
//   document.querySelector('#kqr').style.display = 'none'
// }

function toggleExistingDataLoad (data) {
  document.querySelectorAll('.currentShares')[0].textContent = data
  document.querySelectorAll('.sharesArea')[0].style.display = 'block'
}


// window.onload = () => {
  window.loginRequest();
// }

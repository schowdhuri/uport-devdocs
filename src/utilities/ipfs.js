import ipfsAPI from 'ipfs-api'

const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})

export function addFile (buf) {
  return new Promise((resolve, reject) => {
    ipfs.files.add(buf, (err, result) => {
      if (err) {
        console.error(err)
        reject(err)
      }
      resolve(result[0].hash)
    })
  })
}

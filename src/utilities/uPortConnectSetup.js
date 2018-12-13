import { Connect } from 'uport-connect'
let uPortConnect = {}

if (typeof window !== 'undefined') {
  uPortConnect = new Connect('MyApps', {
    profileImage: {'/': '/ipfs/QmdKanPraYmgJzaPiNMx5r4D8VixnkezeZrMiG1mw6fbwk'},
    bannerImage: {'/': '/ipfs/QmTFNFu1v4dev6YCDoMuSG9Zi3EubagUJ4LQxoZkMiBPSF'},
    description: 'uPort Developer Portal'
  })
}

export {uPortConnect}

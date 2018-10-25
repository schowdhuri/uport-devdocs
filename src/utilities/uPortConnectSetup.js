import { Connect } from 'uport-connect'
let uPortConnect = {}

if (typeof window !== 'undefined') {
  uPortConnect = new Connect('MyApps')
}

export {uPortConnect}

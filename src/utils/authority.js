import { cookie } from '../utils/utils'

export function getAuthority() {
  return cookie.get('u_id')
}

export function setAuthority(value) {
  return cookie.set('u_id', value)
}

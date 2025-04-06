import { createAuthClient } from 'better-auth/react'

const auth = createAuthClient({
  /** the base url of the server (optional if you're using the same domain) */
  baseURL: 'http://localhost:3000',
})

export default function useAuth() {
  return auth
}

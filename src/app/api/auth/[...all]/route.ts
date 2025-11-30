import { toNextJsHandler } from 'better-auth/next-js'
import { auth } from '@/src/lib/auth/server' // path to your auth file

export const { POST, GET } = toNextJsHandler(auth)

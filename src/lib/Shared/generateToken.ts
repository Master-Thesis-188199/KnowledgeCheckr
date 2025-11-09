import { customAlphabet } from 'nanoid'
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789'

export function generateToken(length: number = 8) {
  return customAlphabet(alphabet, length)()
}

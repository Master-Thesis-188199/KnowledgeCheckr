import { customAlphabet } from 'nanoid'
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789'

export async function generateToken(length: number = 8) {
  return customAlphabet(alphabet, 8).call(length)
}

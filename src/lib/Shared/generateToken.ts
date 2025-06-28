import { storeKnowledgeCheckShareToken } from '@/database/knowledgeCheck/insert'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { customAlphabet } from 'nanoid'
const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ123456789'

export async function generateToken(length: number = 8) {
  return customAlphabet(alphabet, 8).call(length)
}

export async function saveGeneratedShareToken(check_id: KnowledgeCheck['id']) {
  const token = await generateToken()
  await storeKnowledgeCheckShareToken(check_id, token)

  return token
}

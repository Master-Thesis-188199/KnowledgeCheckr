import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { safeParseKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { user } = await requireAuthentication()

  if (!body) return NextResponse.json({ message: 'Body must not be empty!' }, { status: 503 })

  const { success, error, data: check } = safeParseKnowledgeCheck(Object.assign(body, { owner_id: user.id }))
  if (!success) return NextResponse.json({ message: 'Please provide a valid knowledgecheck instance!', errors: error, timestamp: Date.now() }, { status: 500 })

  await insertKnowledgeCheck(user.id, check)

  return NextResponse.json({ success: true }, { status: 200 })
}

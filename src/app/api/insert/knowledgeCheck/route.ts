import { NextRequest, NextResponse } from 'next/server'
import insertKnowledgeCheck from '@/database/knowledgeCheck/insert'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { safeParseCourse } from '@/src/schemas/KnowledgeCheck'

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ message: 'Please provide a valid json body!' }, { status: 400 })
  }

  const { user } = await requireAuthentication()

  if (!body) return NextResponse.json({ message: 'Body must not be empty!' }, { status: 400 })

  const { success, error, data: check } = safeParseCourse(Object.assign(body, { owner_id: user.id }))
  if (!success) return NextResponse.json({ message: 'Please provide a valid knowledgecheck instance!', errors: error, timestamp: Date.now() }, { status: 400 })

  await insertKnowledgeCheck(check)

  return NextResponse.json({ success: true }, { status: 200 })
}

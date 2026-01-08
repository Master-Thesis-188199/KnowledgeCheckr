import { NextResponse } from 'next/server'
import _logger from '@/src/lib/log/Logger'
import { LogSchema } from '@/src/lib/log/type'
import env from '@/src/lib/Shared/Env'
import { Any } from '@/types'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  let json: unknown

  try {
    json = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = LogSchema.safeParse(json)
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: 'Invalid logging options' }, { status: 400 })
  }

  if (!env.CAPTURE_CLIENT_LOGS) return

  const { level, context, messages } = parsed.data
  const logger = _logger.createModuleLogger(context ? `client/${context}` : 'Client')

  // eslint-disable-next-line prefer-spread
  logger[level].apply(logger, messages as Any)

  return new NextResponse(null, { status: 204 })
}

import { NextResponse } from 'next/server'
import getVersion from '@/lib/Shared/getVersion'

export async function GET() {
  const version = await getVersion()

  return NextResponse.json({ version })
}

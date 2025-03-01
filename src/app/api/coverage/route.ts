import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.json({
    coverage: global.__coverage__ || null,
  })
}

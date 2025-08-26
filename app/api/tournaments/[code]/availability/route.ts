import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ available: true, teams: 0 })
}


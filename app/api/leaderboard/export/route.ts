import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse('CSV export not implemented', {
    status: 501,
    headers: { 'Content-Type': 'text/plain' }
  })
}


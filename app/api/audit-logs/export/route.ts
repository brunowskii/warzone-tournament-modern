import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse('Export not implemented', {
    status: 501,
    headers: { 'Content-Type': 'text/plain' }
  })
}


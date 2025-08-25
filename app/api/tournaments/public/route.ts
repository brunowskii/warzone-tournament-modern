import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const where: any = {
      // Only show non-demo tournaments
      isDemo: false
    }

    if (status) {
      where.status = status
    }

    const tournaments = await prisma.tournament.findMany({
      where,
      select: {
        id: true,
        name: true,
        code: true,
        mode: true,
        format: true,
        status: true,
        startDate: true,
        startTime: true,
        totalTeams: true,
        teamSize: true,
        topFraggerEnabled: true,
        _count: {
          select: {
            teams: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // PENDING first, then ACTIVE, then COMPLETED
        { startDate: 'asc' }
      ]
    })

    return NextResponse.json(tournaments)
  } catch (error) {
    console.error('Error fetching public tournaments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 }
    )
  }
}

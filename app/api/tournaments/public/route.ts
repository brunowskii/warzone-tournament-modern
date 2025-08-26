import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      select: {
        id: true,
        name: true,
        code: true,
        mode: true,
        format: true,
        status: true,
        startDate: true,
        startTime: true,
        maxTeams: true,
        currentTeams: true,
        totalMatches: true,
        countedMatches: true,
        topFraggerEnabled: true,
        overlayTheme: true,
        description: true,
        prizePool: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            teams: true
          }
        }
      },
      orderBy: [
        { status: 'asc' }, // ACTIVE first, then RECRUITING, etc.
        { startDate: 'asc' }
      ]
    })

    // Update currentTeams count from the actual team count
    const tournamentsWithTeamCount = tournaments.map(tournament => ({
      ...tournament,
      currentTeams: tournament._count.teams
    }))

    return NextResponse.json(tournamentsWithTeamCount)
  } catch (error) {
    console.error('Error fetching public tournaments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 }
    )
  }
}

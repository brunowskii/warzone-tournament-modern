import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params

    const tournament = await prisma.tournament.findUnique({
      where: { code },
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
        scoringProfile: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            teams: true
          }
        }
      }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      )
    }

    // Update currentTeams count from the actual team count
    const tournamentWithTeamCount = {
      ...tournament,
      currentTeams: tournament._count.teams
    }

    return NextResponse.json(tournamentWithTeamCount)
  } catch (error) {
    console.error('Error fetching tournament:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournament' },
      { status: 500 }
    )
  }
}



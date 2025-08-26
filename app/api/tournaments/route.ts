import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
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
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Update currentTeams count from actual team count
    const tournamentsWithTeamCount = tournaments.map(tournament => ({
      ...tournament,
      currentTeams: tournament._count.teams
    }))

    return NextResponse.json(tournamentsWithTeamCount)
  } catch (error) {
    console.error('Error fetching tournaments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournaments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      name,
      mode,
      format,
      startDate,
      startTime,
      maxTeams,
      totalMatches,
      countedMatches,
      topFraggerEnabled,
      overlayTheme,
      description,
      prizePool
    } = body

    // Generate unique tournament code
    const code = `T${Date.now().toString().slice(-6)}`

    const tournament = await prisma.tournament.create({
      data: {
        name,
        code,
        mode,
        format,
        status: 'RECRUITING',
        startDate,
        startTime,
        maxTeams,
        currentTeams: 0,
        totalMatches,
        countedMatches,
        topFraggerEnabled: topFraggerEnabled || false,
        overlayTheme: overlayTheme || 'ice',
        description,
        prizePool,
        scoringProfile: {
          multipliers: {
            1: 100,
            2: 80,
            3: 60,
            4: 40,
            5: 30,
            6: 25,
            7: 20,
            8: 15,
            9: 10,
            10: 5
          },
          killPoints: 1
        }
      }
    })

    return NextResponse.json(tournament, { status: 201 })
  } catch (error) {
    console.error('Error creating tournament:', error)
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    )
  }
}


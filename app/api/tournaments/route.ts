import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { calculateTournamentConfig, generateTournamentCode, DEFAULT_SCORING_PROFILES } from '@/lib/tournament-utils'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const owned = searchParams.get('owned') === 'true'

    const where: any = {}
    if (status) where.status = status
    if (owned) where.ownerId = user.id

    const tournaments = await prisma.tournament.findMany({
      where,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        teams: {
          select: {
            id: true
          }
        },
        _count: {
          select: {
            teams: true,
            matches: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(tournaments)
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
    const user = await getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      mode,
      format,
      numberOfMatches,
      topFraggerEnabled,
      startDate,
      startTime,
      obsTheme,
      customScoring
    } = body

    // Validate required fields
    if (!name || !mode || !format) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Calculate tournament configuration
    const config = calculateTournamentConfig(mode, format)
    
    // Generate unique tournament code
    let tournamentCode: string
    let isUnique = false
    while (!isUnique) {
      tournamentCode = generateTournamentCode()
      const existing = await prisma.tournament.findUnique({
        where: { code: tournamentCode }
      })
      if (!existing) {
        isUnique = true
      }
    }

    // Get scoring profile
    const scoringProfile = customScoring || DEFAULT_SCORING_PROFILES[mode]

    // Create tournament
    const tournament = await prisma.tournament.create({
      data: {
        name,
        code: tournamentCode!,
        mode,
        format,
        teamSize: config.teamSize,
        playerCap: config.playerCap,
        totalTeams: config.totalTeams,
        numberOfMatches,
        topFraggerEnabled,
        scoringProfile,
        obsTheme: obsTheme || 'dark',
        startDate: startDate ? new Date(startDate) : null,
        startTime,
        ownerId: user.id
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'TOURNAMENT_CREATED',
        details: `Tournament "${name}" created with code ${tournamentCode}`,
        metadata: {
          tournamentId: tournament.id,
          mode,
          format,
          totalTeams: config.totalTeams,
          topFraggerEnabled
        },
        tournamentId: tournament.id,
        userId: user.id
      }
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.error('Error creating tournament:', error)
    return NextResponse.json(
      { error: 'Failed to create tournament' },
      { status: 500 }
    )
  }
}

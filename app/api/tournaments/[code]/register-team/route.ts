import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params
    const body = await request.json()
    const { teamName, playerName, activisionId } = body

    // Find tournament
    const tournament = await prisma.tournament.findUnique({
      where: { code },
      select: {
        id: true,
        maxTeams: true,
        status: true,
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

    if (tournament.status !== 'RECRUITING') {
      return NextResponse.json(
        { error: 'Tournament is not accepting registrations' },
        { status: 400 }
      )
    }

    if (tournament._count.teams >= tournament.maxTeams) {
      return NextResponse.json(
        { error: 'Tournament is full' },
        { status: 400 }
      )
    }

    // Generate unique team code
    const teamCode = `T${Date.now().toString().slice(-6)}`

    // Create team and player
    const team = await prisma.team.create({
      data: {
        name: teamName,
        code: teamCode,
        tournamentId: tournament.id,
        players: {
          create: {
            playerName,
            activisionId,
            isTeamLeader: true
          }
        }
      },
      include: {
        players: true
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'TEAM_REGISTERED',
        details: `Team ${teamName} registered for tournament`,
        tournamentId: tournament.id,
        userId: null, // Will be set when user system is implemented
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    return NextResponse.json(team, { status: 201 })
  } catch (error) {
    console.error('Error registering team:', error)
    return NextResponse.json(
      { error: 'Failed to register team' },
      { status: 500 }
    )
  }
}


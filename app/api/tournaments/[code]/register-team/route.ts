import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateTeamCode } from '@/lib/utils'

export async function POST(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params
    const body = await request.json()
    const {
      teamName,
      teamLeader,
      teamLeaderName,
      players,
      accessCode
    } = body

    // Find tournament by code
    const tournament = await prisma.tournament.findUnique({
      where: { code },
      include: {
        teams: {
          select: {
            id: true
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

    // Check if tournament is accepting registrations
    if (tournament.status !== 'PENDING' && tournament.status !== 'ACTIVE') {
      return NextResponse.json(
        { error: 'Tournament is not accepting registrations' },
        { status: 400 }
      )
    }

    // Check if team limit reached
    if (tournament.teams.length >= tournament.totalTeams) {
      return NextResponse.json(
        { error: 'Tournament is full' },
        { status: 400 }
      )
    }

    // Validate team size
    const expectedTeamSize = tournament.teamSize
    const actualTeamSize = players ? players.length + 1 : 1 // +1 for team leader

    if (actualTeamSize !== expectedTeamSize) {
      return NextResponse.json(
        { error: `Team must have exactly ${expectedTeamSize} player(s)` },
        { status: 400 }
      )
    }

    // Check if team name already exists in tournament
    const existingTeam = await prisma.team.findFirst({
      where: {
        tournamentId: tournament.id,
        name: teamName
      }
    })

    if (existingTeam) {
      return NextResponse.json(
        { error: 'Team name already exists in this tournament' },
        { status: 400 }
      )
    }

    // Check if team leader already registered
    const existingLeader = await prisma.team.findFirst({
      where: {
        tournamentId: tournament.id,
        teamLeader
      }
    })

    if (existingLeader) {
      return NextResponse.json(
        { error: 'Team leader already registered in this tournament' },
        { status: 400 }
      )
    }

    // Generate unique team code
    let teamCode: string
    let isUnique = false
    while (!isUnique) {
      teamCode = generateTeamCode(Math.floor(Math.random() * 999) + 1)
      const existing = await prisma.team.findUnique({
        where: { code: teamCode }
      })
      if (!existing) {
        isUnique = true
      }
    }

    // Generate unique access code
    let teamAccessCode: string
    let isAccessUnique = false
    while (!isAccessUnique) {
      teamAccessCode = generateTeamCode(Math.floor(Math.random() * 999) + 1)
      const existing = await prisma.team.findUnique({
        where: { accessCode: teamAccessCode }
      })
      if (!existing) {
        isAccessUnique = true
      }
    }

    // Create team
    const team = await prisma.team.create({
      data: {
        name: teamName,
        code: teamCode!,
        accessCode: teamAccessCode!,
        teamLeader,
        lobby: 'TBD',
        tournamentId: tournament.id
      }
    })

    // Create team leader player record
    await prisma.teamPlayer.create({
      data: {
        activisionId: teamLeader,
        playerName: teamLeaderName,
        isTeamLeader: true,
        teamId: team.id
      }
    })

    // Create player records if Top Fragger is enabled
    if (tournament.topFraggerEnabled && players) {
      for (const player of players) {
        await prisma.teamPlayer.create({
          data: {
            activisionId: player.activisionId,
            playerName: player.playerName,
            isTeamLeader: false,
            teamId: team.id
          }
        })

        // Create or update player stats
        await prisma.playerStat.upsert({
          where: {
            tournamentId_activisionId: {
              tournamentId: tournament.id,
              activisionId: player.activisionId
            }
          },
          update: {},
          create: {
            activisionId: player.activisionId,
            playerName: player.playerName,
            tournamentId: tournament.id
          }
        })
      }
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'TEAM_REGISTERED',
        details: `Team "${teamName}" registered for tournament "${tournament.name}"`,
        metadata: {
          tournamentId: tournament.id,
          teamId: team.id,
          teamCode: teamCode,
          teamSize: actualTeamSize,
          topFraggerEnabled: tournament.topFraggerEnabled
        },
        tournamentId: tournament.id,
        userId: 'system', // System action
        targetTeam: teamCode
      }
    })

    return NextResponse.json({
      success: true,
      team: {
        id: team.id,
        name: team.name,
        code: team.code,
        accessCode: team.accessCode,
        teamLeader,
        tournament: {
          id: tournament.id,
          name: tournament.name,
          mode: tournament.mode,
          format: tournament.format,
          topFraggerEnabled: tournament.topFraggerEnabled
        }
      }
    })
  } catch (error) {
    console.error('Error registering team:', error)
    return NextResponse.json(
      { error: 'Failed to register team' },
      { status: 500 }
    )
  }
}

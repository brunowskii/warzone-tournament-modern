import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params

    // Find tournament by code
    const tournament = await prisma.tournament.findUnique({
      where: { code },
      include: {
        teams: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
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

    const availableSlots = tournament.totalTeams - tournament._count.teams
    const isAcceptingRegistrations = tournament.status === 'PENDING' || tournament.status === 'ACTIVE'
    const isFull = availableSlots <= 0

    return NextResponse.json({
      tournament: {
        id: tournament.id,
        name: tournament.name,
        code: tournament.code,
        mode: tournament.mode,
        format: tournament.format,
        teamSize: tournament.teamSize,
        totalTeams: tournament.totalTeams,
        topFraggerEnabled: tournament.topFraggerEnabled,
        status: tournament.status,
        startDate: tournament.startDate,
        startTime: tournament.startTime
      },
      availability: {
        totalSlots: tournament.totalTeams,
        registeredTeams: tournament._count.teams,
        availableSlots,
        isFull,
        isAcceptingRegistrations
      },
      registeredTeams: tournament.teams.map(team => ({
        name: team.name,
        code: team.code
      }))
    })
  } catch (error) {
    console.error('Error fetching tournament availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tournament availability' },
      { status: 500 }
    )
  }
}

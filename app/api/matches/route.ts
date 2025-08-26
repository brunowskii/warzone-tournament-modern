import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tournamentId = searchParams.get('tournamentId')
    const teamId = searchParams.get('teamId')

    const where: any = {}
    if (tournamentId) where.tournamentId = tournamentId
    if (teamId) where.teamId = teamId

    const matches = await prisma.match.findMany({
      where,
      include: {
        team: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        evidence: {
          select: {
            id: true,
            type: true,
            url: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(matches)
  } catch (error) {
    console.error('Error fetching matches:', error)
    return NextResponse.json(
      { error: 'Failed to fetch matches' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      tournamentId,
      teamId,
      position,
      kills,
      evidence
    } = body

    // Calculate score based on position and kills
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: { scoringProfile: true }
    })

    const scoringProfile = tournament?.scoringProfile as any
    const multipliers = scoringProfile?.multipliers || {
      1: 100, 2: 80, 3: 60, 4: 40, 5: 30,
      6: 25, 7: 20, 8: 15, 9: 10, 10: 5
    }
    const killPoints = scoringProfile?.killPoints || 1

    const positionMultiplier = multipliers[position] || 0
    const score = (positionMultiplier + (kills * killPoints))

    const match = await prisma.match.create({
      data: {
        tournamentId,
        teamId,
        position,
        kills,
        score,
        status: 'PENDING',
        evidence: {
          create: evidence?.map((ev: any) => ({
            type: ev.type || 'SCREENSHOT',
            url: ev.url,
            filename: ev.filename,
            size: ev.size
          })) || []
        }
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        evidence: true
      }
    })

    return NextResponse.json(match, { status: 201 })
  } catch (error) {
    console.error('Error creating match:', error)
    return NextResponse.json(
      { error: 'Failed to create match' },
      { status: 500 }
    )
  }
}


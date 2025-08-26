import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { status, reason, reviewerId } = body

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      )
    }

    const match = await prisma.match.findUnique({
      where: { id },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            code: true,
            tournamentId: true
          }
        }
      }
    })

    if (!match) {
      return NextResponse.json(
        { error: 'Match not found' },
        { status: 404 }
      )
    }

    // Update match status
    const updatedMatch = await prisma.match.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date()
      },
      include: {
        team: {
          select: {
            id: true,
            name: true,
            code: true
          }
        }
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: `MATCH_${status}`,
        details: `Match ${status.toLowerCase()}${reason ? `: ${reason}` : ''}`,
        tournamentId: match.team.tournamentId,
        userId: reviewerId,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    // If approved, update player stats
    if (status === 'APPROVED') {
      // Find existing player stat or create new one
      const existingStat = await prisma.playerStat.findFirst({
        where: {
          tournamentId: match.team.tournamentId,
          playerName: match.team.name
        }
      })

      if (existingStat) {
        await prisma.playerStat.update({
          where: { id: existingStat.id },
          data: {
            totalKills: {
              increment: match.kills
            },
            matchesPlayed: {
              increment: 1
            }
          }
        })
      } else {
        await prisma.playerStat.create({
          data: {
            tournamentId: match.team.tournamentId,
            playerName: match.team.name,
            totalKills: match.kills,
            averageKills: match.kills,
            matchesPlayed: 1
          }
        })
      }
    }

    return NextResponse.json(updatedMatch)
  } catch (error) {
    console.error('Error reviewing match:', error)
    return NextResponse.json(
      { error: 'Failed to review match' },
      { status: 500 }
    )
  }
}


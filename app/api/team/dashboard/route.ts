import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const teamCode = searchParams.get('teamCode')
    const tournamentId = searchParams.get('tournamentId')

    if (!teamCode) {
      return NextResponse.json(
        { error: 'Team code is required' },
        { status: 400 }
      )
    }

    const team = await prisma.team.findFirst({
      where: {
        code: teamCode,
        ...(tournamentId && { tournamentId })
      },
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
            code: true,
            status: true,
            totalMatches: true,
            countedMatches: true,
            scoringProfile: true
          }
        },
        players: {
          select: {
            id: true,
            playerName: true,
            activisionId: true,
            isTeamLeader: true
          }
        },
        matches: {
          select: {
            id: true,
            position: true,
            kills: true,
            score: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        scoreAdjustments: {
          select: {
            id: true,
            reason: true,
            amount: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!team) {
      return NextResponse.json(
        { error: 'Team not found' },
        { status: 404 }
      )
    }

    // Calculate team statistics
    const approvedMatches = team.matches.filter(m => m.status === 'APPROVED')
    const bestMatches = approvedMatches
      .sort((a, b) => b.score - a.score)
      .slice(0, team.tournament.countedMatches)

    const totalScore = bestMatches.reduce((sum, match) => sum + match.score, 0)
    const adjustmentTotal = team.scoreAdjustments.reduce((sum, adj) => sum + adj.amount, 0)
    const finalScore = totalScore + adjustmentTotal

    const dashboardData = {
      team,
      statistics: {
        totalMatches: team.matches.length,
        approvedMatches: approvedMatches.length,
        pendingMatches: team.matches.filter(m => m.status === 'PENDING').length,
        totalScore,
        adjustmentTotal,
        finalScore,
        bestMatches: bestMatches.length
      }
    }

    return NextResponse.json(dashboardData)
  } catch (error) {
    console.error('Error fetching team dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team dashboard' },
      { status: 500 }
    )
  }
}


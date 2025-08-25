import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateTeamStats, calculateLeaderboard } from '@/lib/scoring'

export async function GET() {
  try {
    // Get all teams with their matches and adjustments
    const teams = await prisma.team.findMany({
      include: {
        matches: {
          where: {
            status: 'APPROVED'
          },
          orderBy: {
            submittedAt: 'desc'
          }
        },
        scoreAdjustments: {
          orderBy: {
            appliedAt: 'desc'
          }
        },
        tournament: {
          select: {
            countedMatches: true
          }
        }
      }
    })

    // Calculate team statistics
    const teamStats = teams.map(team => {
      const countedMatches = team.tournament?.countedMatches || 5
      return calculateTeamStats(
        team,
        team.matches,
        team.scoreAdjustments,
        countedMatches
      )
    })

    // Calculate leaderboard with rankings
    const leaderboard = calculateLeaderboard(teamStats)

    return NextResponse.json(leaderboard)
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

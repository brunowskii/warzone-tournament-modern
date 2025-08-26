import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { tournamentId: string } }
) {
  try {
    const { tournamentId } = params

    // Find tournament by ID or code
    const tournament = await prisma.tournament.findFirst({
      where: {
        OR: [
          { id: tournamentId },
          { code: tournamentId }
        ]
      },
      select: {
        id: true,
        name: true,
        code: true,
        countedMatches: true,
        scoringProfile: true,
        topFraggerEnabled: true
      }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      )
    }

    // Get all teams with their matches
    const teams = await prisma.team.findMany({
      where: { tournamentId: tournament.id },
      include: {
        matches: {
          where: { status: 'APPROVED' },
          select: {
            position: true,
            kills: true,
            score: true
          }
        },
        scoreAdjustments: {
          select: {
            amount: true
          }
        }
      }
    })

    // Calculate scores for each team
    const scoringProfile = tournament.scoringProfile as any
    const countedMatches = tournament.countedMatches

    const leaderboard = teams.map(team => {
      const bestMatches = team.matches
        .sort((a, b) => b.score - a.score)
        .slice(0, countedMatches)

      const totalScore = bestMatches.reduce((sum, match) => sum + match.score, 0)
      const adjustmentTotal = team.scoreAdjustments.reduce((sum, adj) => sum + adj.amount, 0)
      const finalScore = totalScore + adjustmentTotal

      return {
        id: team.id,
        name: team.name,
        code: team.code,
        totalScore,
        adjustmentTotal,
        finalScore,
        matchesPlayed: team.matches.length,
        bestMatches: bestMatches.length
      }
    })

    // Sort by final score and assign ranks
    leaderboard.sort((a, b) => b.finalScore - a.finalScore)
    leaderboard.forEach((team, index) => {
      team.rank = index + 1
    })

    // Get top fragger stats if enabled
    let topFraggerStats = null
    if (tournament.topFraggerEnabled) {
      topFraggerStats = await prisma.playerStat.findMany({
        where: { tournamentId: tournament.id },
        select: {
          id: true,
          playerName: true,
          totalKills: true,
          averageKills: true,
          matchesPlayed: true
        },
        orderBy: { totalKills: 'desc' },
        take: 10
      })
    }

    return NextResponse.json({
      tournament: {
        id: tournament.id,
        name: tournament.name,
        code: tournament.code
      },
      leaderboard,
      topFraggerStats,
      lastUpdated: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error fetching public leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch leaderboard' },
      { status: 500 }
    )
  }
}

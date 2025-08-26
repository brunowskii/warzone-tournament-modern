import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { tournamentId: string } }
) {
  try {
    const { tournamentId } = params

    // Get tournament details
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
        scoringProfile: true
      }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      )
    }

    // Get all teams for this tournament
    const teams = await prisma.team.findMany({
      where: { tournamentId: tournament.id },
      select: {
        id: true,
        name: true,
        code: true,
        matches: {
          where: { status: 'APPROVED' },
          select: {
            score: true,
            createdAt: true
          },
          orderBy: { score: 'desc' }
        },
        scoreAdjustments: {
          select: {
            amount: true
          }
        }
      }
    })

    // Calculate team scores
    const teamScores = teams.map(team => {
      const bestScores = team.matches
        .slice(0, tournament.countedMatches)
        .map(match => match.score)
      
      const totalScore = bestScores.reduce((sum, score) => sum + score, 0)
      const adjustmentTotal = team.scoreAdjustments.reduce((sum, adj) => sum + adj.amount, 0)
      const finalScore = totalScore + adjustmentTotal

      return {
        id: team.id,
        name: team.name,
        code: team.code,
        totalScore: finalScore,
        matchesPlayed: team.matches.length,
        bestScores: bestScores
      }
    })

    // Sort by total score (descending)
    const sortedTeams = teamScores.sort((a, b) => b.totalScore - a.totalScore)

    // Add rank
    const leaderboard = sortedTeams.map((team, index) => ({
      ...team,
      rank: index + 1
    }))

    // Get top fragger stats if enabled
    let topFraggerStats = []
    if (tournament.scoringProfile?.topFraggerEnabled) {
      const playerStats = await prisma.playerStat.findMany({
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

      topFraggerStats = playerStats
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

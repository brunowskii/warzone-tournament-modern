import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tournamentId = searchParams.get('tournamentId')

    if (!tournamentId) {
      return NextResponse.json(
        { error: 'Tournament ID is required' },
        { status: 400 }
      )
    }

    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
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

    // Get all teams with their matches
    const teams = await prisma.team.findMany({
      where: { tournamentId },
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

    const leaderboardData = teams.map(team => {
      const bestMatches = team.matches
        .sort((a, b) => b.score - a.score)
        .slice(0, countedMatches)

      const totalScore = bestMatches.reduce((sum, match) => sum + match.score, 0)
      const adjustmentTotal = team.scoreAdjustments.reduce((sum, adj) => sum + adj.amount, 0)
      const finalScore = totalScore + adjustmentTotal

      return {
        rank: 0, // Will be calculated after sorting
        teamName: team.name,
        teamCode: team.code,
        totalScore,
        adjustmentTotal,
        finalScore,
        matchesPlayed: team.matches.length,
        bestMatches: bestMatches.length
      }
    })

    // Sort by final score and assign ranks
    leaderboardData.sort((a, b) => b.finalScore - a.finalScore)
    leaderboardData.forEach((team, index) => {
      team.rank = index + 1
    })

    // Generate CSV content
    const csvHeaders = [
      'Rank',
      'Team Name',
      'Team Code',
      'Total Score',
      'Adjustments',
      'Final Score',
      'Matches Played',
      'Best Matches'
    ]

    const csvRows = leaderboardData.map(team => [
      team.rank,
      team.teamName,
      team.teamCode,
      team.totalScore.toFixed(1),
      team.adjustmentTotal.toFixed(1),
      team.finalScore.toFixed(1),
      team.matchesPlayed,
      team.bestMatches
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.join(','))
    ].join('\n')

    const filename = `leaderboard-${tournament.code}-${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Error exporting leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to export leaderboard' },
      { status: 500 }
    )
  }
}


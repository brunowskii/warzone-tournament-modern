import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateTeamStats } from '@/lib/scoring'

export async function GET(
  request: NextRequest,
  { params }: { params: { tournamentId: string } }
) {
  try {
    const { tournamentId } = params
    const { searchParams } = new URL(request.url)
    const preview = searchParams.get('preview') === 'true'

    // Find tournament
    const tournament = await prisma.tournament.findUnique({
      where: { id: tournamentId },
      select: {
        id: true,
        name: true,
        code: true,
        mode: true,
        format: true,
        status: true,
        topFraggerEnabled: true,
        scoringProfile: true
      }
    })

    if (!tournament) {
      return NextResponse.json(
        { error: 'Tournament not found' },
        { status: 404 }
      )
    }

    // If preview mode, return limited data
    if (preview) {
      const teamCount = await prisma.team.count({
        where: { tournamentId }
      })

      return NextResponse.json({
        tournament: {
          id: tournament.id,
          name: tournament.name,
          code: tournament.code,
          mode: tournament.mode,
          format: tournament.format,
          status: tournament.status,
          topFraggerEnabled: tournament.topFraggerEnabled
        },
        preview: {
          teamCount,
          hasLeaderboard: teamCount > 0
        }
      })
    }

    // Get teams with their matches
    const teams = await prisma.team.findMany({
      where: { tournamentId },
      include: {
        matches: {
          where: { status: 'APPROVED' },
          orderBy: { matchNumber: 'asc' }
        },
        scoreAdjustments: true,
        players: true
      },
      orderBy: { name: 'asc' }
    })

    // Calculate team stats
    const teamStats = teams.map(team => {
      const stats = calculateTeamStats(team.matches, team.scoreAdjustments, tournament.scoringProfile as any)
      return {
        id: team.id,
        name: team.name,
        code: team.code,
        ...stats,
        players: team.players.map(player => ({
          activisionId: player.activisionId,
          playerName: player.playerName,
          isTeamLeader: player.isTeamLeader
        }))
      }
    })

    // Sort by total score (descending)
    teamStats.sort((a, b) => b.totalScore - a.totalScore)

    // Add rank
    const leaderboard = teamStats.map((team, index) => ({
      ...team,
      rank: index + 1
    }))

    // Get top fragger stats if enabled
    let topFraggerStats = null
    if (tournament.topFraggerEnabled) {
      const playerStats = await prisma.playerStat.findMany({
        where: { tournamentId },
        orderBy: [
          { totalKills: 'desc' },
          { averageKills: 'desc' }
        ],
        take: 20 // Top 20 players
      })

      topFraggerStats = playerStats.map((player, index) => ({
        ...player,
        rank: index + 1
      }))
    }

    return NextResponse.json({
      tournament: {
        id: tournament.id,
        name: tournament.name,
        code: tournament.code,
        mode: tournament.mode,
        format: tournament.format,
        status: tournament.status,
        topFraggerEnabled: tournament.topFraggerEnabled
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

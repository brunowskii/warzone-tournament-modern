<<<<<<< HEAD
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { calculateTeamStats, calculateLeaderboard } from '@/lib/scoring'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find the team that the user belongs to
    const team = await prisma.team.findFirst({
      where: {
        userId: user.id
      },
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
            status: true,
            countedMatches: true
          }
        },
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
        }
      }
    })

    if (!team) {
      return NextResponse.json({ error: 'No team found' }, { status: 404 })
    }

    // Calculate team stats
    const teamStats = calculateTeamStats(
      team,
      team.matches,
      team.scoreAdjustments,
      team.tournament.countedMatches
    )

    // Get all teams for leaderboard calculation
    const allTeams = await prisma.team.findMany({
      where: { tournamentId: team.tournamentId },
      include: {
        matches: {
          where: {
            status: 'APPROVED'
          }
        },
        scoreAdjustments: true
      }
    })

    const allTeamStats = allTeams.map(t => 
      calculateTeamStats(t, t.matches, t.scoreAdjustments, team.tournament.countedMatches)
    )

    const leaderboard = calculateLeaderboard(allTeamStats)
    const teamRank = leaderboard.find(t => t.teamCode === team.code)

    // Get all matches for the team (including pending/rejected)
    const allMatches = await prisma.match.findMany({
      where: {
        teamCode: team.code
      },
      orderBy: {
        submittedAt: 'desc'
      }
    })

    return NextResponse.json({
      teamStats: teamRank || teamStats,
      matches: allMatches
    })
  } catch (error) {
    console.error('Error fetching team dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team dashboard' },
      { status: 500 }
    )
  }
}
=======
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { calculateTeamStats, calculateLeaderboard } from '@/lib/scoring'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Find the team that the user belongs to
    const team = await prisma.team.findFirst({
      where: {
        userId: user.id
      },
      include: {
        tournament: {
          select: {
            id: true,
            name: true,
            status: true,
            countedMatches: true
          }
        },
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
        }
      }
    })

    if (!team) {
      return NextResponse.json({ error: 'No team found' }, { status: 404 })
    }

    // Calculate team stats
    const teamStats = calculateTeamStats(
      team,
      team.matches,
      team.scoreAdjustments,
      team.tournament.countedMatches
    )

    // Get all teams for leaderboard calculation
    const allTeams = await prisma.team.findMany({
      where: { tournamentId: team.tournamentId },
      include: {
        matches: {
          where: {
            status: 'APPROVED'
          }
        },
        scoreAdjustments: true
      }
    })

    const allTeamStats = allTeams.map(t => 
      calculateTeamStats(t, t.matches, t.scoreAdjustments, team.tournament.countedMatches)
    )

    const leaderboard = calculateLeaderboard(allTeamStats)
    const teamRank = leaderboard.find(t => t.teamCode === team.code)

    // Get all matches for the team (including pending/rejected)
    const allMatches = await prisma.match.findMany({
      where: {
        teamCode: team.code
      },
      orderBy: {
        submittedAt: 'desc'
      }
    })

    return NextResponse.json({
      teamStats: teamRank || teamStats,
      matches: allMatches
    })
  } catch (error) {
    console.error('Error fetching team dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch team dashboard' },
      { status: 500 }
    )
  }
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d

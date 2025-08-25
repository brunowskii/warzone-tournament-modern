<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format')

    // Get leaderboard data
    const teams = await prisma.team.findMany({
      include: {
        scores: {
          include: {
            match: true,
          },
        },
      },
    })

    const teamStats = teams.map(team => {
      const totalPoints = team.scores.reduce((sum, score) => sum + score.points, 0)
      const totalKills = team.scores.reduce((sum, score) => sum + score.kills, 0)
      const matches = team.scores.length

      return {
        id: team.id,
        name: team.name,
        totalPoints,
        totalKills,
        matches,
        avgPoints: matches > 0 ? totalPoints / matches : 0,
      }
    })

    const sortedTeams = teamStats.sort((a, b) => b.totalPoints - a.totalPoints)

    if (format === 'csv') {
      // Generate CSV
      const csvHeader = 'Position,Team,Points,Kills,Matches,Avg Points\n'
      const csvRows = sortedTeams.map((team, index) => 
        `${index + 1},${team.name},${team.totalPoints.toFixed(1)},${team.totalKills},${team.matches},${team.avgPoints.toFixed(1)}`
      ).join('\n')
      
      const csvContent = csvHeader + csvRows

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="leaderboard.csv"',
        },
      })
    } else if (format === 'png') {
      // For PNG export, we'll return a simple text representation
      // In a real implementation, you'd use a library like html2canvas or puppeteer
      const pngContent = `Leaderboard Export\n\n${sortedTeams.map((team, index) => 
        `${index + 1}. ${team.name} - ${team.totalPoints.toFixed(1)} points (${team.totalKills} kills)`
      ).join('\n')}`

      return new NextResponse(pngContent, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': 'attachment; filename="leaderboard.txt"',
        },
      })
    }

    return NextResponse.json(
      { error: 'Invalid format. Use "csv" or "png"' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error exporting leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to export leaderboard' },
      { status: 500 }
    )
  }
}
=======
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format')

    // Get leaderboard data
    const teams = await prisma.team.findMany({
      include: {
        scores: {
          include: {
            match: true,
          },
        },
      },
    })

    const teamStats = teams.map(team => {
      const totalPoints = team.scores.reduce((sum, score) => sum + score.points, 0)
      const totalKills = team.scores.reduce((sum, score) => sum + score.kills, 0)
      const matches = team.scores.length

      return {
        id: team.id,
        name: team.name,
        totalPoints,
        totalKills,
        matches,
        avgPoints: matches > 0 ? totalPoints / matches : 0,
      }
    })

    const sortedTeams = teamStats.sort((a, b) => b.totalPoints - a.totalPoints)

    if (format === 'csv') {
      // Generate CSV
      const csvHeader = 'Position,Team,Points,Kills,Matches,Avg Points\n'
      const csvRows = sortedTeams.map((team, index) => 
        `${index + 1},${team.name},${team.totalPoints.toFixed(1)},${team.totalKills},${team.matches},${team.avgPoints.toFixed(1)}`
      ).join('\n')
      
      const csvContent = csvHeader + csvRows

      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="leaderboard.csv"',
        },
      })
    } else if (format === 'png') {
      // For PNG export, we'll return a simple text representation
      // In a real implementation, you'd use a library like html2canvas or puppeteer
      const pngContent = `Leaderboard Export\n\n${sortedTeams.map((team, index) => 
        `${index + 1}. ${team.name} - ${team.totalPoints.toFixed(1)} points (${team.totalKills} kills)`
      ).join('\n')}`

      return new NextResponse(pngContent, {
        headers: {
          'Content-Type': 'text/plain',
          'Content-Disposition': 'attachment; filename="leaderboard.txt"',
        },
      })
    }

    return NextResponse.json(
      { error: 'Invalid format. Use "csv" or "png"' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error exporting leaderboard:', error)
    return NextResponse.json(
      { error: 'Failed to export leaderboard' },
      { status: 500 }
    )
  }
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d

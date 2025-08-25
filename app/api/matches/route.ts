<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { calculateMatchScore } from '@/lib/scoring'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { position, kills, fileUrls, fileNames, fileSizes, mimeTypes } = body

    // Validate input
    if (!position || !kills || !fileUrls || fileUrls.length < 2) {
      return NextResponse.json({ error: 'Invalid submission data' }, { status: 400 })
    }

    // Get user's team
    const team = await prisma.team.findFirst({
      where: { 
        userId: user.id
      },
      include: { tournament: true }
    })

    if (!team) {
      return NextResponse.json({ error: 'No team found for user' }, { status: 404 })
    }

    // Calculate score
    const scoreCalculation = calculateMatchScore(kills, position)

    // Create match submission
    const match = await prisma.match.create({
      data: {
        position,
        kills,
        score: scoreCalculation.finalScore,
        status: 'PENDING',
        teamCode: team.code,
        tournamentId: team.tournamentId
      }
    })

    // Create file submissions
    const submissions = await Promise.all(
      fileUrls.map((url: string, index: number) =>
        prisma.submission.create({
          data: {
            type: 'SCREENSHOT',
            fileUrl: url,
            fileName: fileNames[index],
            fileSize: fileSizes[index],
            mimeType: mimeTypes[index],
            matchId: match.id,
            userId: user.id
          }
        })
      )
    )

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'MATCH_SUBMITTED',
        details: `Match submitted: Position ${position}, Kills ${kills}`,
        metadata: {
          matchId: match.id,
          position,
          kills,
          score: scoreCalculation.finalScore,
          fileCount: fileUrls.length
        },
        tournamentId: team.tournamentId,
        userId: user.id,
        targetTeam: team.code
      }
    })

    return NextResponse.json({ 
      success: true, 
      match: { ...match, submissions },
      scoreCalculation 
    })
  } catch (error) {
    console.error('Error submitting match:', error)
    return NextResponse.json(
      { error: 'Failed to submit match' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const tournamentId = searchParams.get('tournamentId')

    // Build where clause
    const where: any = {}
    if (status) where.status = status
    if (tournamentId) where.tournamentId = tournamentId

    // If user is not admin/manager, only show their team's matches
    if (user.role === 'TEAM') {
      const team = await prisma.team.findFirst({
        where: { 
          userId: user.id
        }
      })
      if (team) {
        where.teamCode = team.code
      }
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        team: true,
        submissions: true,
        reviewer: true
      },
      orderBy: { submittedAt: 'desc' }
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
=======
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'
import { calculateMatchScore } from '@/lib/scoring'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { position, kills, fileUrls, fileNames, fileSizes, mimeTypes } = body

    // Validate input
    if (!position || !kills || !fileUrls || fileUrls.length < 2) {
      return NextResponse.json({ error: 'Invalid submission data' }, { status: 400 })
    }

    // Get user's team
    const team = await prisma.team.findFirst({
      where: { 
        userId: user.id
      },
      include: { tournament: true }
    })

    if (!team) {
      return NextResponse.json({ error: 'No team found for user' }, { status: 404 })
    }

    // Calculate score
    const scoreCalculation = calculateMatchScore(kills, position)

    // Create match submission
    const match = await prisma.match.create({
      data: {
        position,
        kills,
        score: scoreCalculation.finalScore,
        status: 'PENDING',
        teamCode: team.code,
        tournamentId: team.tournamentId
      }
    })

    // Create file submissions
    const submissions = await Promise.all(
      fileUrls.map((url: string, index: number) =>
        prisma.submission.create({
          data: {
            type: 'SCREENSHOT',
            fileUrl: url,
            fileName: fileNames[index],
            fileSize: fileSizes[index],
            mimeType: mimeTypes[index],
            matchId: match.id,
            userId: user.id
          }
        })
      )
    )

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'MATCH_SUBMITTED',
        details: `Match submitted: Position ${position}, Kills ${kills}`,
        metadata: {
          matchId: match.id,
          position,
          kills,
          score: scoreCalculation.finalScore,
          fileCount: fileUrls.length
        },
        tournamentId: team.tournamentId,
        userId: user.id,
        targetTeam: team.code
      }
    })

    return NextResponse.json({ 
      success: true, 
      match: { ...match, submissions },
      scoreCalculation 
    })
  } catch (error) {
    console.error('Error submitting match:', error)
    return NextResponse.json(
      { error: 'Failed to submit match' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const tournamentId = searchParams.get('tournamentId')

    // Build where clause
    const where: any = {}
    if (status) where.status = status
    if (tournamentId) where.tournamentId = tournamentId

    // If user is not admin/manager, only show their team's matches
    if (user.role === 'TEAM') {
      const team = await prisma.team.findFirst({
        where: { 
          userId: user.id
        }
      })
      if (team) {
        where.teamCode = team.code
      }
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        team: true,
        submissions: true,
        reviewer: true
      },
      orderBy: { submittedAt: 'desc' }
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
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d

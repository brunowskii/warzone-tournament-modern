<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, rejectionReason } = body

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    if (status === 'REJECTED' && !rejectionReason) {
      return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 })
    }

    // Get the match with team info
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: { team: true }
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    // Update match status
    const updatedMatch = await prisma.match.update({
      where: { id: params.id },
      data: {
        status,
        reviewedAt: new Date(),
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
        reviewedBy: user.id
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: `MATCH_${status}`,
        details: status === 'REJECTED' 
          ? `Match rejected: ${rejectionReason}`
          : 'Match approved',
        metadata: {
          matchId: match.id,
          teamCode: match.teamCode,
          position: match.position,
          kills: match.kills,
          previousStatus: match.status,
          newStatus: status
        },
        tournamentId: match.tournamentId,
        userId: user.id,
        targetTeam: match.teamCode
      }
    })

    return NextResponse.json({ 
      success: true, 
      match: updatedMatch 
    })
  } catch (error) {
    console.error('Error reviewing match:', error)
    return NextResponse.json(
      { error: 'Failed to review match' },
      { status: 500 }
    )
  }
}
=======
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'MANAGER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { status, rejectionReason } = body

    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    if (status === 'REJECTED' && !rejectionReason) {
      return NextResponse.json({ error: 'Rejection reason required' }, { status: 400 })
    }

    // Get the match with team info
    const match = await prisma.match.findUnique({
      where: { id: params.id },
      include: { team: true }
    })

    if (!match) {
      return NextResponse.json({ error: 'Match not found' }, { status: 404 })
    }

    // Update match status
    const updatedMatch = await prisma.match.update({
      where: { id: params.id },
      data: {
        status,
        reviewedAt: new Date(),
        rejectionReason: status === 'REJECTED' ? rejectionReason : null,
        reviewedBy: user.id
      }
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: `MATCH_${status}`,
        details: status === 'REJECTED' 
          ? `Match rejected: ${rejectionReason}`
          : 'Match approved',
        metadata: {
          matchId: match.id,
          teamCode: match.teamCode,
          position: match.position,
          kills: match.kills,
          previousStatus: match.status,
          newStatus: status
        },
        tournamentId: match.tournamentId,
        userId: user.id,
        targetTeam: match.teamCode
      }
    })

    return NextResponse.json({ 
      success: true, 
      match: updatedMatch 
    })
  } catch (error) {
    console.error('Error reviewing match:', error)
    return NextResponse.json(
      { error: 'Failed to review match' },
      { status: 500 }
    )
  }
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d

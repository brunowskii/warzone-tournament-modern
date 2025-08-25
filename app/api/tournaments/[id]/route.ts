import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { status } = body

    const tournament = await prisma.tournament.update({
      where: { id: params.id },
      data: { status },
      include: {
        teams: {
          include: {
            members: true,
          },
        },
        matches: true,
      },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'TOURNAMENT_STATUS_UPDATED',
        details: `Tournament "${tournament.name}" status changed to ${status}`,
        userId: user.id,
        tournamentId: tournament.id,
      },
    })

    return NextResponse.json(tournament)
  } catch (error) {
    console.error('Error updating tournament:', error)
    return NextResponse.json(
      { error: 'Failed to update tournament' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const tournament = await prisma.tournament.delete({
      where: { id: params.id },
    })

    // Create audit log
    await prisma.auditLog.create({
      data: {
        action: 'TOURNAMENT_DELETED',
        details: `Tournament "${tournament.name}" deleted`,
        userId: user.id,
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting tournament:', error)
    return NextResponse.json(
      { error: 'Failed to delete tournament' },
      { status: 500 }
    )
  }
}

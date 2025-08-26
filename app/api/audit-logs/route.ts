import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'
export const runtime = 'edge'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tournamentId = searchParams.get('tournamentId')
    const userId = searchParams.get('userId')
    const action = searchParams.get('action')
    const limit = parseInt(searchParams.get('limit') || '100')
    const offset = parseInt(searchParams.get('offset') || '0')

    const where: any = {}
    if (tournamentId) where.tournamentId = tournamentId
    if (userId) where.userId = userId
    if (action) where.action = action

    const auditLogs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        },
        tournament: {
          select: {
            id: true,
            name: true,
            code: true
          }
        },
        evidence: {
          select: {
            id: true,
            type: true,
            url: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit,
      skip: offset
    })

    const total = await prisma.auditLog.count({ where })

    return NextResponse.json({
      items: auditLogs,
      total,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}


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
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}
    if (tournamentId) where.tournamentId = tournamentId
    if (userId) where.userId = userId
    if (action) where.action = action
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    const auditLogs = await prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            email: true,
            name: true,
            role: true
          }
        },
        tournament: {
          select: {
            name: true,
            code: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Generate CSV content
    const csvHeaders = [
      'Timestamp',
      'Action',
      'Details',
      'User',
      'User Role',
      'Tournament',
      'IP Address',
      'User Agent'
    ]

    const csvRows = auditLogs.map(log => [
      log.createdAt.toISOString(),
      log.action,
      log.details,
      log.user?.email || 'System',
      log.user?.role || 'N/A',
      log.tournament?.name || 'N/A',
      log.ipAddress,
      log.userAgent
    ])

    const csvContent = [
      csvHeaders.join(','),
      ...csvRows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    const filename = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })
  } catch (error) {
    console.error('Error exporting audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to export audit logs' },
      { status: 500 }
    )
  }
}


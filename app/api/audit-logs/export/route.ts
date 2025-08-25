import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        tournament: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Generate CSV
    const csvHeader = 'Date,Action,Details,User,Tournament\n'
    const csvRows = logs.map(log => 
      `"${new Date(log.createdAt).toISOString()}","${log.action}","${log.details || ''}","${log.user ? `${log.user.name} (${log.user.email})` : 'System'}","${log.tournament?.name || ''}"`
    ).join('\n')
    
    const csvContent = csvHeader + csvRows

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="audit-logs.csv"',
      },
    })
  } catch (error) {
    console.error('Error exporting audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to export audit logs' },
      { status: 500 }
    )
  }
}

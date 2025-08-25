<<<<<<< HEAD
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
        evidence: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}
=======
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
        evidence: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json(logs)
  } catch (error) {
    console.error('Error fetching audit logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch audit logs' },
      { status: 500 }
    )
  }
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d

import { PrismaClient, Role, TournamentType, TournamentStatus, SubmissionStatus, AdjustmentType, SubmissionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo users
  const admin = await prisma.user.upsert({
    where: { email: 'admin@warzone.com' },
    update: {},
    create: {
      email: 'admin@warzone.com',
      name: 'Admin User',
      role: Role.ADMIN,
    },
  })

  const manager = await prisma.user.upsert({
    where: { email: 'manager@warzone.com' },
    update: {},
    create: {
      email: 'manager@warzone.com',
      name: 'Manager User',
      role: Role.MANAGER,
    },
  })

  const teamUser = await prisma.user.upsert({
    where: { email: 'team@warzone.com' },
    update: {},
    create: {
      email: 'team@warzone.com',
      name: 'Team User',
      role: Role.TEAM,
    },
  })

  // Create demo tournament
  const tournament = await prisma.tournament.create({
    data: {
      name: 'Demo Tournament 2024',
      type: TournamentType.RITORNO,
      status: TournamentStatus.ACTIVE,
      startDate: new Date('2024-01-15'),
      startTime: '20:00',
      lobbies: 2,
      slotsPerLobby: 20,
      totalMatches: 10,
      countedMatches: 5,
      createdBy: admin.id,
      managers: {
        connect: [{ id: manager.id }]
      },
      isDemo: true,
    },
  })

  // Create demo teams
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: 'Team Alpha',
        code: 'ALPHA-001',
        lobby: 'Lobby A',
        lobbyNumber: 1,
        playerName: 'Player Alpha',
        clanName: 'Alpha Clan',
        tournamentId: tournament.id,
        userId: teamUser.id,
      },
    }),
    prisma.team.create({
      data: {
        name: 'Team Beta',
        code: 'BETA-002',
        lobby: 'Lobby A',
        lobbyNumber: 1,
        playerName: 'Player Beta',
        clanName: 'Beta Clan',
        tournamentId: tournament.id,
      },
    }),
    prisma.team.create({
      data: {
        name: 'Team Gamma',
        code: 'GAMMA-003',
        lobby: 'Lobby B',
        lobbyNumber: 2,
        playerName: 'Player Gamma',
        clanName: 'Gamma Clan',
        tournamentId: tournament.id,
      },
    }),
    prisma.team.create({
      data: {
        name: 'Team Delta',
        code: 'DELTA-004',
        lobby: 'Lobby B',
        lobbyNumber: 2,
        playerName: 'Player Delta',
        clanName: 'Delta Clan',
        tournamentId: tournament.id,
      },
    }),
    prisma.team.create({
      data: {
        name: 'Team Echo',
        code: 'ECHO-005',
        lobby: 'Lobby A',
        lobbyNumber: 1,
        playerName: 'Player Echo',
        clanName: 'Echo Clan',
        tournamentId: tournament.id,
      },
    }),
  ])

  // Create demo matches
  const matches = await Promise.all([
    // Team Alpha matches
    prisma.match.create({
      data: {
        position: 1,
        kills: 15,
        score: 30.0, // 15 kills * 2.0 multiplier
        status: SubmissionStatus.APPROVED,
        teamCode: 'ALPHA-001',
        tournamentId: tournament.id,
        reviewedBy: manager.id,
        reviewedAt: new Date(),
      },
    }),
    prisma.match.create({
      data: {
        position: 3,
        kills: 12,
        score: 21.6, // 12 kills * 1.8 multiplier
        status: SubmissionStatus.APPROVED,
        teamCode: 'ALPHA-001',
        tournamentId: tournament.id,
        reviewedBy: manager.id,
        reviewedAt: new Date(),
      },
    }),
    // Team Beta matches
    prisma.match.create({
      data: {
        position: 2,
        kills: 10,
        score: 18.0, // 10 kills * 1.8 multiplier
        status: SubmissionStatus.APPROVED,
        teamCode: 'BETA-002',
        tournamentId: tournament.id,
        reviewedBy: manager.id,
        reviewedAt: new Date(),
      },
    }),
    prisma.match.create({
      data: {
        position: 4,
        kills: 8,
        score: 12.8, // 8 kills * 1.6 multiplier
        status: SubmissionStatus.APPROVED,
        teamCode: 'BETA-002',
        tournamentId: tournament.id,
        reviewedBy: manager.id,
        reviewedAt: new Date(),
      },
    }),
    // Team Gamma matches
    prisma.match.create({
      data: {
        position: 5,
        kills: 6,
        score: 9.6, // 6 kills * 1.6 multiplier
        status: SubmissionStatus.APPROVED,
        teamCode: 'GAMMA-003',
        tournamentId: tournament.id,
        reviewedBy: manager.id,
        reviewedAt: new Date(),
      },
    }),
    prisma.match.create({
      data: {
        position: 6,
        kills: 5,
        score: 8.0, // 5 kills * 1.6 multiplier
        status: SubmissionStatus.APPROVED,
        teamCode: 'GAMMA-003',
        tournamentId: tournament.id,
        reviewedBy: manager.id,
        reviewedAt: new Date(),
      },
    }),
    // Team Delta matches
    prisma.match.create({
      data: {
        position: 7,
        kills: 4,
        score: 5.6, // 4 kills * 1.4 multiplier
        status: SubmissionStatus.APPROVED,
        teamCode: 'DELTA-004',
        tournamentId: tournament.id,
        reviewedBy: manager.id,
        reviewedAt: new Date(),
      },
    }),
    // Team Echo matches
    prisma.match.create({
      data: {
        position: 8,
        kills: 3,
        score: 4.2, // 3 kills * 1.4 multiplier
        status: SubmissionStatus.APPROVED,
        teamCode: 'ECHO-005',
        tournamentId: tournament.id,
        reviewedBy: manager.id,
        reviewedAt: new Date(),
      },
    }),
  ])

  // Create demo submissions (evidence)
  await Promise.all([
    prisma.submission.create({
      data: {
        type: SubmissionType.SCREENSHOT,
        fileUrl: 'https://example.com/screenshot1.jpg',
        fileName: 'screenshot1.jpg',
        fileSize: 1024000,
        mimeType: 'image/jpeg',
        matchId: matches[0].id,
        userId: teamUser.id,
      },
    }),
    prisma.submission.create({
      data: {
        type: SubmissionType.SCREENSHOT,
        fileUrl: 'https://example.com/screenshot2.jpg',
        fileName: 'screenshot2.jpg',
        fileSize: 1024000,
        mimeType: 'image/jpeg',
        matchId: matches[0].id,
        userId: teamUser.id,
      },
    }),
  ])

  // Create demo score adjustments
  await prisma.scoreAdjustment.create({
    data: {
      points: -10.0,
      reason: 'Late submission penalty',
      type: AdjustmentType.PENALTY,
      teamCode: 'DELTA-004',
      tournamentId: tournament.id,
      appliedBy: manager.id,
    },
  })

  // Create demo audit logs
  await Promise.all([
    prisma.auditLog.create({
      data: {
        action: 'TOURNAMENT_CREATED',
        details: 'Demo tournament created by admin',
        userId: admin.id,
        tournamentId: tournament.id,
        metadata: {
          tournamentName: tournament.name,
          tournamentType: tournament.type,
        },
      },
    }),
    prisma.auditLog.create({
      data: {
        action: 'TEAM_REGISTERED',
        details: 'Team Alpha registered for tournament',
        userId: admin.id,
        tournamentId: tournament.id,
        targetTeam: 'ALPHA-001',
        metadata: {
          teamName: 'Team Alpha',
          teamCode: 'ALPHA-001',
        },
      },
    }),
    prisma.auditLog.create({
      data: {
        action: 'MATCH_SUBMITTED',
        details: 'Match results submitted by Team Alpha',
        userId: teamUser.id,
        tournamentId: tournament.id,
        targetTeam: 'ALPHA-001',
        metadata: {
          position: 1,
          kills: 15,
          score: 30.0,
        },
      },
    }),
    prisma.auditLog.create({
      data: {
        action: 'MATCH_APPROVED',
        details: 'Match approved by manager',
        userId: manager.id,
        tournamentId: tournament.id,
        targetTeam: 'ALPHA-001',
        metadata: {
          position: 1,
          kills: 15,
          score: 30.0,
        },
      },
    }),
    prisma.auditLog.create({
      data: {
        action: 'SCORE_ADJUSTMENT',
        details: 'Score adjustment applied to Team Delta',
        userId: manager.id,
        tournamentId: tournament.id,
        targetTeam: 'DELTA-004',
        metadata: {
          points: -10.0,
          reason: 'Late submission penalty',
          type: 'PENALTY',
        },
      },
    }),
  ])

  console.log('✅ Database seeded successfully!')
  console.log(`👥 Created ${teams.length} teams`)
  console.log(`🎮 Created ${matches.length} matches`)
  console.log(`📊 Created tournament: ${tournament.name}`)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

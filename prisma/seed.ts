import { PrismaClient, Role, GameMode, TeamFormat, TournamentStatus } from '@prisma/client'

// Generate a random tournament code
function generateTournamentCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean up existing data
  console.log('🧹 Cleaning up existing data...')
  await prisma.auditLog.deleteMany()
  await prisma.scoreAdjustment.deleteMany()
  await prisma.submission.deleteMany()
  await prisma.playerKill.deleteMany()
  await prisma.match.deleteMany()
  await prisma.playerStat.deleteMany()
  await prisma.teamPlayer.deleteMany()
  await prisma.team.deleteMany()
  await prisma.obsOverlay.deleteMany()
  await prisma.tournament.deleteMany()
  await prisma.user.deleteMany()

  // Create admin user
  console.log('👤 Creating admin user...')
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@warzone.com',
      name: 'Tournament Admin',
      role: Role.ADMIN,
    },
  })

  // Create manager user
  console.log('👤 Creating manager user...')
  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@warzone.com',
      name: 'Tournament Manager',
      role: Role.MANAGER,
    },
  })

  // Create demo tournament
  console.log('🏆 Creating demo tournament...')
  const demoTournament = await prisma.tournament.create({
    data: {
      name: 'Warzone Championship 2024',
      code: generateTournamentCode(),
      mode: GameMode.BR,
      format: TeamFormat.TRIOS,
      teamSize: 3,
      playerCap: 150,
      totalTeams: 50,
      numberOfMatches: 5,
      topFraggerEnabled: true,
      scoringProfile: {
        killMultiplier: 1.0,
        placementPoints: {
          1: 15, 2: 12, 3: 10, 4: 8, 5: 6, 6: 4, 7: 2, 8: 1,
          9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1, 15: 1,
          16: 1, 17: 1, 18: 1, 19: 1, 20: 1
        },
        placementMultipliers: {
          1: 2.0, 2: 1.8, 3: 1.6, 4: 1.4, 5: 1.2, 6: 1.0, 7: 1.0, 8: 1.0,
          9: 1.0, 10: 1.0, 11: 1.0, 12: 1.0, 13: 1.0, 14: 1.0, 15: 1.0,
          16: 1.0, 17: 1.0, 18: 1.0, 19: 1.0, 20: 1.0
        }
      },
      obsTheme: 'dark',
      status: TournamentStatus.ACTIVE,
      startDate: new Date('2024-01-15T18:00:00Z'),
      startTime: '18:00',
      ownerId: adminUser.id,
      isDemo: true,
    },
  })

  // Create demo teams
  console.log('👥 Creating demo teams...')
  const demoTeams = await Promise.all([
    prisma.team.create({
      data: {
        name: 'Alpha Squad',
        code: 'ALPHA-001',
        accessCode: 'ABC123',
        lobby: 'Lobby A',
        lobbyNumber: 1,
        teamLeader: 'AlphaLeader#1234',
        tournamentId: demoTournament.id,
        userId: adminUser.id,
        players: {
          create: [
            {
              activisionId: 'AlphaLeader#1234',
              playerName: 'Alpha Leader',
              isTeamLeader: true,
            },
            {
              activisionId: 'AlphaPlayer2#5678',
              playerName: 'Alpha Player 2',
              isTeamLeader: false,
            },
            {
              activisionId: 'AlphaPlayer3#9012',
              playerName: 'Alpha Player 3',
              isTeamLeader: false,
            },
          ],
        },
      },
    }),
    prisma.team.create({
      data: {
        name: 'Beta Warriors',
        code: 'BETA-001',
        accessCode: 'DEF456',
        lobby: 'Lobby A',
        lobbyNumber: 1,
        teamLeader: 'BetaLeader#5678',
        tournamentId: demoTournament.id,
        userId: managerUser.id,
        players: {
          create: [
            {
              activisionId: 'BetaLeader#5678',
              playerName: 'Beta Leader',
              isTeamLeader: true,
            },
            {
              activisionId: 'BetaPlayer2#1234',
              playerName: 'Beta Player 2',
              isTeamLeader: false,
            },
            {
              activisionId: 'BetaPlayer3#9012',
              playerName: 'Beta Player 3',
              isTeamLeader: false,
            },
          ],
        },
      },
    }),
    prisma.team.create({
      data: {
        name: 'Gamma Elite',
        code: 'GAMMA-001',
        accessCode: 'GHI789',
        lobby: 'Lobby B',
        lobbyNumber: 2,
        teamLeader: 'GammaLeader#9012',
        tournamentId: demoTournament.id,
        players: {
          create: [
            {
              activisionId: 'GammaLeader#9012',
              playerName: 'Gamma Leader',
              isTeamLeader: true,
            },
            {
              activisionId: 'GammaPlayer2#3456',
              playerName: 'Gamma Player 2',
              isTeamLeader: false,
            },
            {
              activisionId: 'GammaPlayer3#7890',
              playerName: 'Gamma Player 3',
              isTeamLeader: false,
            },
          ],
        },
      },
    }),
  ])

  // Create demo matches
  console.log('🎮 Creating demo matches...')
  const demoMatches = await Promise.all([
    // Alpha Squad matches
    prisma.match.create({
      data: {
        matchNumber: 1,
        position: 3,
        teamKills: 12,
        score: 18.0,
        status: 'APPROVED',
        teamCode: 'ALPHA-001',
        tournamentId: demoTournament.id,
        reviewedBy: adminUser.id,
        reviewedAt: new Date(),
        playerKills: {
          create: [
            { activisionId: 'AlphaLeader#1234', playerName: 'Alpha Leader', kills: 5 },
            { activisionId: 'AlphaPlayer2#5678', playerName: 'Alpha Player 2', kills: 4 },
            { activisionId: 'AlphaPlayer3#9012', playerName: 'Alpha Player 3', kills: 3 },
          ],
        },
      },
    }),
    prisma.match.create({
      data: {
        matchNumber: 2,
        position: 1,
        teamKills: 18,
        score: 36.0,
        status: 'APPROVED',
        teamCode: 'ALPHA-001',
        tournamentId: demoTournament.id,
        reviewedBy: adminUser.id,
        reviewedAt: new Date(),
        playerKills: {
          create: [
            { activisionId: 'AlphaLeader#1234', playerName: 'Alpha Leader', kills: 8 },
            { activisionId: 'AlphaPlayer2#5678', playerName: 'Alpha Player 2', kills: 6 },
            { activisionId: 'AlphaPlayer3#9012', playerName: 'Alpha Player 3', kills: 4 },
          ],
        },
      },
    }),
    // Beta Warriors matches
    prisma.match.create({
      data: {
        matchNumber: 1,
        position: 2,
        teamKills: 15,
        score: 27.0,
        status: 'APPROVED',
        teamCode: 'BETA-001',
        tournamentId: demoTournament.id,
        reviewedBy: adminUser.id,
        reviewedAt: new Date(),
        playerKills: {
          create: [
            { activisionId: 'BetaLeader#5678', playerName: 'Beta Leader', kills: 7 },
            { activisionId: 'BetaPlayer2#1234', playerName: 'Beta Player 2', kills: 5 },
            { activisionId: 'BetaPlayer3#9012', playerName: 'Beta Player 3', kills: 3 },
          ],
        },
      },
    }),
    prisma.match.create({
      data: {
        matchNumber: 2,
        position: 4,
        teamKills: 8,
        score: 8.0,
        status: 'APPROVED',
        teamCode: 'BETA-001',
        tournamentId: demoTournament.id,
        reviewedBy: adminUser.id,
        reviewedAt: new Date(),
        playerKills: {
          create: [
            { activisionId: 'BetaLeader#5678', playerName: 'Beta Leader', kills: 4 },
            { activisionId: 'BetaPlayer2#1234', playerName: 'Beta Player 2', kills: 3 },
            { activisionId: 'BetaPlayer3#9012', playerName: 'Beta Player 3', kills: 1 },
          ],
        },
      },
    }),
    // Gamma Elite matches
    prisma.match.create({
      data: {
        matchNumber: 1,
        position: 1,
        teamKills: 20,
        score: 40.0,
        status: 'APPROVED',
        teamCode: 'GAMMA-001',
        tournamentId: demoTournament.id,
        reviewedBy: adminUser.id,
        reviewedAt: new Date(),
        playerKills: {
          create: [
            { activisionId: 'GammaLeader#9012', playerName: 'Gamma Leader', kills: 9 },
            { activisionId: 'GammaPlayer2#3456', playerName: 'Gamma Player 2', kills: 7 },
            { activisionId: 'GammaPlayer3#7890', playerName: 'Gamma Player 3', kills: 4 },
          ],
        },
      },
    }),
  ])

  // Create demo score adjustments
  console.log('📊 Creating demo score adjustments...')
  await prisma.scoreAdjustment.create({
    data: {
      points: 5.0,
      reason: 'Excellent sportsmanship',
      type: 'REWARD',
      teamCode: 'ALPHA-001',
      tournamentId: demoTournament.id,
      appliedBy: adminUser.id,
    },
  })

  // Create demo audit logs
  console.log('📝 Creating demo audit logs...')
  await prisma.auditLog.createMany({
    data: [
      {
        action: 'TOURNAMENT_CREATED',
        details: 'Demo tournament created',
        tournamentId: demoTournament.id,
        userId: adminUser.id,
        metadata: { tournamentName: demoTournament.name },
      },
      {
        action: 'TEAM_REGISTERED',
        details: 'Alpha Squad registered',
        tournamentId: demoTournament.id,
        userId: adminUser.id,
        targetTeam: 'ALPHA-001',
        metadata: { teamName: 'Alpha Squad' },
      },
      {
        action: 'MATCH_APPROVED',
        details: 'Match 1 approved for Alpha Squad',
        tournamentId: demoTournament.id,
        userId: adminUser.id,
        targetTeam: 'ALPHA-001',
        metadata: { matchNumber: 1, position: 3, kills: 12 },
      },
    ],
  })

  // Create OBS overlay
  console.log('📺 Creating OBS overlay...')
  await prisma.oBSOverlay.create({
    data: {
      tournamentId: demoTournament.id,
      type: 'LEADERBOARD',
      theme: 'DARK',
      refreshRate: 5000,
      showLogos: true,
      showStats: true,
      isActive: true,
    },
  })

  // Create player stats
  console.log('📈 Creating player stats...')
  await prisma.playerStat.createMany({
    data: [
      {
        activisionId: 'AlphaLeader#1234',
        playerName: 'Alpha Leader',
        totalKills: 13,
        totalMatches: 2,
        averageKills: 6.5,
        bestKills: 8,
        tournamentId: demoTournament.id,
        userId: adminUser.id,
      },
      {
        activisionId: 'GammaLeader#9012',
        playerName: 'Gamma Leader',
        totalKills: 9,
        totalMatches: 1,
        averageKills: 9.0,
        bestKills: 9,
        tournamentId: demoTournament.id,
      },
      {
        activisionId: 'BetaLeader#5678',
        playerName: 'Beta Leader',
        totalKills: 11,
        totalMatches: 2,
        averageKills: 5.5,
        bestKills: 7,
        tournamentId: demoTournament.id,
        userId: managerUser.id,
      },
    ],
  })

  console.log('✅ Database seeding completed successfully!')
  console.log('')
  console.log('📊 Demo Data Created:')
  console.log(`- Admin User: admin@warzone.com`)
  console.log(`- Manager User: manager@warzone.com`)
  console.log(`- Tournament: ${demoTournament.name} (${demoTournament.code})`)
  console.log(`- Teams: ${demoTeams.length} teams created`)
  console.log(`- Matches: ${demoMatches.length} matches created`)
  console.log('')
  console.log('🎮 Your Warzone Tournament System is ready!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

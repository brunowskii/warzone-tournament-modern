import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Owner account configuration
  const ownerEmail = process.env.OWNER_EMAIL || 'chahbouni.badr@outlook.com'
  const ownerPassword = process.env.OWNER_PASSWORD || 'Veronapressanac5!'
  
  // Hash the password
  const hashedPassword = await hash(ownerPassword, 12)
  
  // Upsert owner user and store hashed password
  const owner = await prisma.user.upsert({
    where: { email: ownerEmail },
    update: { password: hashedPassword }, // updates password if user exists
    create: {
      email: ownerEmail,
      name: 'System Owner',
      role: 'OWNER',
      password: hashedPassword,
    },
  })

  console.log('✅ Owner user created:', owner.email)

  // Create demo tournaments
  const tournaments = await Promise.all([
    prisma.tournament.upsert({
      where: { code: 'WC2024' },
      update: {},
      create: {
        name: 'Warzone Championship 2024',
        code: 'WC2024',
        mode: 'Battle Royale',
        format: 'Best 3 of 5',
        status: 'ACTIVE',
        startDate: new Date('2024-02-15T20:00:00Z'),
        startTime: '20:00',
        maxTeams: 60,
        currentTeams: 42,
        totalMatches: 5,
        countedMatches: 3,
        topFraggerEnabled: true,
        overlayTheme: 'ice',
        description: 'The ultimate Warzone competition featuring the best teams from around the world.',
        prizePool: '$250',
        scoringProfile: {
          multipliers: {
            1: 2.0, 2: 1.8, 3: 1.8, 4: 1.6, 5: 1.6, 6: 1.6,
            7: 1.4, 8: 1.4, 9: 1.4, 10: 1.4, 11: 1.0, 12: 1.0,
            13: 1.0, 14: 1.0, 15: 1.0, 16: 1.0, 17: 1.0, 18: 1.0,
            19: 1.0, 20: 1.0
          }
        }
      },
    }),
    prisma.tournament.upsert({
      where: { code: 'RS2024' },
      update: {},
      create: {
        name: 'Resurgence Showdown',
        code: 'RS2024',
        mode: 'Resurgence',
        format: 'Best 2 of 3',
        status: 'RECRUITING',
        startDate: new Date('2024-02-20T19:00:00Z'),
        startTime: '19:00',
        maxTeams: 40,
        currentTeams: 28,
        totalMatches: 3,
        countedMatches: 2,
        topFraggerEnabled: true,
        overlayTheme: 'neon',
        description: 'Fast-paced Resurgence action with quick respawns and intense battles.',
        prizePool: '$25,000',
        scoringProfile: {
          multipliers: {
            1: 2.5, 2: 2.0, 3: 1.8, 4: 1.6, 5: 1.4, 6: 1.2,
            7: 1.0, 8: 1.0, 9: 1.0, 10: 1.0, 11: 1.0, 12: 1.0,
            13: 1.0, 14: 1.0, 15: 1.0, 16: 1.0, 17: 1.0, 18: 1.0,
            19: 1.0, 20: 1.0
          }
        }
      },
    }),
    prisma.tournament.upsert({
      where: { code: 'WW2024' },
      update: {},
      create: {
        name: 'Weekend Warriors',
        code: 'WW2024',
        mode: 'Battle Royale',
        format: 'Single Elimination',
        status: 'RECRUITING',
        startDate: new Date('2024-02-25T18:00:00Z'),
        startTime: '18:00',
        maxTeams: 30,
        currentTeams: 15,
        totalMatches: 1,
        countedMatches: 1,
        topFraggerEnabled: false,
        overlayTheme: 'dark',
        description: 'Casual tournament for weekend players looking for competitive fun.',
        prizePool: '$10,000',
        scoringProfile: {
          multipliers: {
            1: 2.0, 2: 1.8, 3: 1.6, 4: 1.4, 5: 1.2, 6: 1.0,
            7: 1.0, 8: 1.0, 9: 1.0, 10: 1.0, 11: 1.0, 12: 1.0,
            13: 1.0, 14: 1.0, 15: 1.0, 16: 1.0, 17: 1.0, 18: 1.0,
            19: 1.0, 20: 1.0
          }
        }
      },
    }),
  ])

  console.log('✅ Tournaments created:', tournaments.length)

  // Create demo teams for the first tournament
  const teamNames = [
    'BlackCrow Alpha', 'BlackCrow Beta', 'BlackCrow Gamma', 'BlackCrow Delta',
    'Shadow Wolves', 'Phoenix Rising', 'Thunder Strike', 'Ice Breakers',
    'Golden Eagles', 'Silver Bullets', 'Crimson Tide', 'Emerald Knights',
    'Azure Dragons', 'Violet Vipers', 'Orange Crush', 'Purple Reign',
    'Green Machine', 'Blue Thunder', 'Red Alert', 'Yellow Jackets'
  ]

  const teams = await Promise.all(
    teamNames.slice(0, 15).map(async (name, index) => {
      const teamCode = `BC${String(index + 1).padStart(3, '0')}`
      
      return prisma.team.upsert({
        where: { code: teamCode },
        update: {},
        create: {
          name,
          code: teamCode,
          tournamentId: tournaments[0].id,
        },
      })
    })
  )

  console.log('✅ Teams created:', teams.length)

  // Create demo players for each team
  const players = []
  for (const team of teams) {
    const playerNames = [
      `${team.name.replace('BlackCrow ', '')}_Player1`,
      `${team.name.replace('BlackCrow ', '')}_Player2`,
      `${team.name.replace('BlackCrow ', '')}_Player3`,
      `${team.name.replace('BlackCrow ', '')}_Player4`
    ]

    for (let i = 0; i < 4; i++) {
      const player = await prisma.player.create({
        data: {
          teamId: team.id,
          activisionId: `${team.code}_${i + 1}`,
          playerName: playerNames[i],
          isTeamLeader: i === 0,
        },
      })
      players.push(player)
    }
  }

  console.log('✅ Players created:', players.length)

  // Create demo matches and scores
  const matches = []
  for (const team of teams.slice(0, 10)) {
    for (let round = 1; round <= 3; round++) {
      const position = Math.floor(Math.random() * 20) + 1
      const kills = Math.floor(Math.random() * 25) + 1
      const score = kills * (position <= 10 ? 2.0 - (position - 1) * 0.1 : 1.0)

      const match = await prisma.match.create({
        data: {
          tournamentId: tournaments[0].id,
          teamId: team.id,
          round,
          position,
          kills,
          score,
          status: 'APPROVED',
        },
      })
      matches.push(match)
    }
  }

  console.log('✅ Matches created:', matches.length)

  // Create demo player stats
  const playerStats = []
  for (const player of players.slice(0, 20)) {
    const totalKills = Math.floor(Math.random() * 100) + 10
    const matchesPlayed = Math.floor(Math.random() * 10) + 1
    const averageKills = totalKills / matchesPlayed

    const stat = await prisma.playerStat.create({
      data: {
        tournamentId: tournaments[0].id,
        playerId: player.id,
        playerName: player.playerName,
        totalKills,
        averageKills,
        matchesPlayed,
      },
    })
    playerStats.push(stat)
  }

  console.log('✅ Player stats created:', playerStats.length)

  // Create access codes
  const accessCodes = await Promise.all([
    // Admin codes
    prisma.accessCode.upsert({
      where: { code: 'MISOKIETI' },
      update: {},
      create: {
        code: 'MISOKIETI',
        type: 'ADMIN',
        userId: owner.id,
        isActive: true,
      },
    }),
    prisma.accessCode.upsert({
      where: { code: 'MISOKIETI8' },
      update: {},
      create: {
        code: 'MISOKIETI8',
        type: 'ADMIN',
        userId: owner.id,
        isActive: true,
      },
    }),
    // Manager codes
    prisma.accessCode.upsert({
      where: { code: 'Overwatch2025' },
      update: {},
      create: {
        code: 'Overwatch2025',
        type: 'MANAGER',
        tournamentId: tournaments[0].id,
        isActive: true,
      },
    }),
    prisma.accessCode.upsert({
      where: { code: 'Manager2024' },
      update: {},
      create: {
        code: 'Manager2024',
        type: 'MANAGER',
        tournamentId: tournaments[0].id,
        isActive: true,
      },
    }),
  ])

  // Create team access codes
  for (const team of teams) {
    await prisma.accessCode.create({
      data: {
        code: team.code,
        type: 'TEAM',
        tournamentId: tournaments[0].id,
        isActive: true,
      },
    })
  }

  console.log('✅ Access codes created:', accessCodes.length + teams.length)

  // Create demo audit logs
  const auditLogs = await Promise.all([
    prisma.auditLog.create({
      data: {
        action: 'TOURNAMENT_CREATED',
        details: `Tournament "${tournaments[0].name}" created by system owner`,
        userId: owner.id,
        tournamentId: tournaments[0].id,
        ipAddress: '127.0.0.1',
        userAgent: 'Seed Script',
      },
    }),
    prisma.auditLog.create({
      data: {
        action: 'TEAMS_REGISTERED',
        details: `${teams.length} teams registered for tournament`,
        userId: owner.id,
        tournamentId: tournaments[0].id,
        ipAddress: '127.0.0.1',
        userAgent: 'Seed Script',
      },
    }),
    prisma.auditLog.create({
      data: {
        action: 'MATCHES_SUBMITTED',
        details: `${matches.length} matches submitted and approved`,
        userId: owner.id,
        tournamentId: tournaments[0].id,
        ipAddress: '127.0.0.1',
        userAgent: 'Seed Script',
      },
    }),
  ])

  console.log('✅ Audit logs created:', auditLogs.length)

  console.log('🎉 Database seeding completed successfully!')
  console.log('📊 Summary:')
  console.log(`   - ${tournaments.length} tournaments`)
  console.log(`   - ${teams.length} teams`)
  console.log(`   - ${players.length} players`)
  console.log(`   - ${matches.length} matches`)
  console.log(`   - ${playerStats.length} player stats`)
  console.log(`   - ${accessCodes.length + teams.length} access codes`)
  console.log(`   - ${auditLogs.length} audit logs`)

  console.log('\n🔑 Access Codes:')
  console.log('   Admin: MISOKIETI, MISOKIETI8')
  console.log('   Manager: Overwatch2025, Manager2024')
  console.log('   Teams: BC001, BC002, BC003, etc.')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

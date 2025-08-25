<<<<<<< HEAD
export interface TournamentConfig {
  mode: 'BR' | 'RESURGENCE'
  format: 'SOLO' | 'DUOS' | 'TRIOS' | 'QUADS'
  teamSize: number
  playerCap: number
  totalTeams: number
}

export interface ScoringProfile {
  killMultiplier: number
  placementPoints: Record<number, number>
  placementMultipliers: Record<number, number>
}

export const GAME_MODE_CONFIGS: Record<string, { playerCap: number; description: string }> = {
  BR: {
    playerCap: 150,
    description: 'Classic Battle Royale with 150 players'
  },
  RESURGENCE: {
    playerCap: 45,
    description: 'Fast-paced Resurgence with 45 players'
  }
}

export const TEAM_FORMAT_CONFIGS: Record<string, { teamSize: number; description: string }> = {
  SOLO: {
    teamSize: 1,
    description: 'Individual players'
  },
  DUOS: {
    teamSize: 2,
    description: 'Two players per team'
  },
  TRIOS: {
    teamSize: 3,
    description: 'Three players per team'
  },
  QUADS: {
    teamSize: 4,
    description: 'Four players per team'
  }
}

export function calculateTournamentConfig(mode: string, format: string): TournamentConfig {
  const gameMode = GAME_MODE_CONFIGS[mode]
  const teamFormat = TEAM_FORMAT_CONFIGS[format]
  
  if (!gameMode || !teamFormat) {
    throw new Error('Invalid game mode or team format')
  }
  
  const totalTeams = Math.floor(gameMode.playerCap / teamFormat.teamSize)
  
  return {
    mode: mode as 'BR' | 'RESURGENCE',
    format: format as 'SOLO' | 'DUOS' | 'TRIOS' | 'QUADS',
    teamSize: teamFormat.teamSize,
    playerCap: gameMode.playerCap,
    totalTeams
  }
}

export function generateTournamentCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateOBSUrl(tournamentId: string, type: 'leaderboard' | 'top-fragger' = 'leaderboard'): string {
  const baseUrl = process.env.OBS_BASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', 'https://') || 'http://localhost:3000'
  return `${baseUrl}/obs/${type}?tid=${tournamentId}`
}

export const DEFAULT_SCORING_PROFILES: Record<string, ScoringProfile> = {
  BR: {
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
  RESURGENCE: {
    killMultiplier: 1.0,
    placementPoints: {
      1: 10, 2: 8, 3: 6, 4: 4, 5: 2, 6: 1, 7: 1, 8: 1,
      9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1, 15: 1
    },
    placementMultipliers: {
      1: 2.0, 2: 1.8, 3: 1.6, 4: 1.4, 5: 1.2, 6: 1.0, 7: 1.0, 8: 1.0,
      9: 1.0, 10: 1.0, 11: 1.0, 12: 1.0, 13: 1.0, 14: 1.0, 15: 1.0
    }
  }
}
=======
export interface TournamentConfig {
  mode: 'BR' | 'RESURGENCE'
  format: 'SOLO' | 'DUOS' | 'TRIOS' | 'QUADS'
  teamSize: number
  playerCap: number
  totalTeams: number
}

export interface ScoringProfile {
  killMultiplier: number
  placementPoints: Record<number, number>
  placementMultipliers: Record<number, number>
}

export const GAME_MODE_CONFIGS: Record<string, { playerCap: number; description: string }> = {
  BR: {
    playerCap: 150,
    description: 'Classic Battle Royale with 150 players'
  },
  RESURGENCE: {
    playerCap: 45,
    description: 'Fast-paced Resurgence with 45 players'
  }
}

export const TEAM_FORMAT_CONFIGS: Record<string, { teamSize: number; description: string }> = {
  SOLO: {
    teamSize: 1,
    description: 'Individual players'
  },
  DUOS: {
    teamSize: 2,
    description: 'Two players per team'
  },
  TRIOS: {
    teamSize: 3,
    description: 'Three players per team'
  },
  QUADS: {
    teamSize: 4,
    description: 'Four players per team'
  }
}

export function calculateTournamentConfig(mode: string, format: string): TournamentConfig {
  const gameMode = GAME_MODE_CONFIGS[mode]
  const teamFormat = TEAM_FORMAT_CONFIGS[format]
  
  if (!gameMode || !teamFormat) {
    throw new Error('Invalid game mode or team format')
  }
  
  const totalTeams = Math.floor(gameMode.playerCap / teamFormat.teamSize)
  
  return {
    mode: mode as 'BR' | 'RESURGENCE',
    format: format as 'SOLO' | 'DUOS' | 'TRIOS' | 'QUADS',
    teamSize: teamFormat.teamSize,
    playerCap: gameMode.playerCap,
    totalTeams
  }
}

export function generateTournamentCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateOBSUrl(tournamentId: string, type: 'leaderboard' | 'top-fragger' = 'leaderboard'): string {
  const baseUrl = process.env.OBS_BASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', 'https://') || 'http://localhost:3000'
  return `${baseUrl}/obs/${type}?tid=${tournamentId}`
}

export const DEFAULT_SCORING_PROFILES: Record<string, ScoringProfile> = {
  BR: {
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
  RESURGENCE: {
    killMultiplier: 1.0,
    placementPoints: {
      1: 10, 2: 8, 3: 6, 4: 4, 5: 2, 6: 1, 7: 1, 8: 1,
      9: 1, 10: 1, 11: 1, 12: 1, 13: 1, 14: 1, 15: 1
    },
    placementMultipliers: {
      1: 2.0, 2: 1.8, 3: 1.6, 4: 1.4, 5: 1.2, 6: 1.0, 7: 1.0, 8: 1.0,
      9: 1.0, 10: 1.0, 11: 1.0, 12: 1.0, 13: 1.0, 14: 1.0, 15: 1.0
    }
  }
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d

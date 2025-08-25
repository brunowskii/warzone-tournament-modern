<<<<<<< HEAD
// Position multipliers for scoring calculation
export const DEFAULT_MULTIPLIERS: Record<number, number> = {
  1: 2.0, 2: 1.8, 3: 1.8, 4: 1.6, 5: 1.6, 6: 1.6,
  7: 1.4, 8: 1.4, 9: 1.4, 10: 1.4, 11: 1.0, 12: 1.0,
  13: 1.0, 14: 1.0, 15: 1.0, 16: 1.0, 17: 1.0, 18: 1.0,
  19: 1.0, 20: 1.0
}

export interface ScoreCalculation {
  kills: number
  position: number
  multiplier: number
  finalScore: number
}

export interface TeamStats {
  teamName: string
  teamCode: string
  matches: any[]
  adjustments: any[]
  totalScore: number
  adjustmentTotal: number
  finalScore: number
  rank: number
  totalKills: number
  matchesCount: number
}

/**
 * Calculate score for a single match
 */
export function calculateMatchScore(kills: number, position: number): ScoreCalculation {
  const multiplier = DEFAULT_MULTIPLIERS[position] || 1.0
  const finalScore = kills * multiplier

  return {
    kills,
    position,
    multiplier,
    finalScore
  }
}

/**
 * Calculate team statistics including best matches
 */
export function calculateTeamStats(
  team: any,
  matches: any[],
  adjustments: any[],
  countedMatches: number = 5
): TeamStats {
  // Calculate scores for all matches
  const matchScores = matches.map(match => ({
    ...match,
    scoreCalculation: calculateMatchScore(match.kills, match.position)
  }))

  // Sort by score and take best matches
  const bestMatches = matchScores
    .sort((a, b) => b.scoreCalculation.finalScore - a.scoreCalculation.finalScore)
    .slice(0, countedMatches)

  // Calculate totals
  const totalScore = bestMatches.reduce((sum, match) => sum + match.scoreCalculation.finalScore, 0)
  const totalKills = matches.reduce((sum, match) => sum + match.kills, 0)
  const adjustmentTotal = adjustments.reduce((sum, adj) => sum + adj.points, 0)
  const finalScore = totalScore + adjustmentTotal

  return {
    teamName: team.name,
    teamCode: team.code,
    matches: matchScores,
    adjustments,
    totalScore,
    adjustmentTotal,
    finalScore,
    rank: 0, // Will be set by leaderboard calculation
    totalKills,
    matchesCount: matches.length
  }
}

/**
 * Calculate leaderboard with rankings
 */
export function calculateLeaderboard(teams: TeamStats[]): TeamStats[] {
  return teams
    .sort((a, b) => b.finalScore - a.finalScore)
    .map((team, index) => ({
      ...team,
      rank: index + 1
    }))
}

/**
 * Get position color for styling
 */
export function getPositionColor(position: number): string {
  switch (position) {
    case 1:
      return 'text-leaderboard-gold'
    case 2:
      return 'text-leaderboard-silver'
    case 3:
      return 'text-leaderboard-bronze'
    default:
      return 'text-muted-foreground'
  }
}

/**
 * Get position background class for styling
 */
export function getPositionBackground(position: number): string {
  switch (position) {
    case 1:
      return 'position-1'
    case 2:
      return 'position-2'
    case 3:
      return 'position-3'
    default:
      return 'position-other'
  }
}

/**
 * Validate match submission
 */
export function validateMatchSubmission(position: number, kills: number, files: File[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (position < 1 || position > 20) {
    errors.push('Position must be between 1 and 20')
  }
  
  if (kills < 0) {
    errors.push('Kills cannot be negative')
  }
  
  if (files.length < 2) {
    errors.push('At least 2 evidence files are required')
  }
  
  if (files.length > 5) {
    errors.push('Maximum 5 evidence files allowed')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
=======
// Position multipliers for scoring calculation
export const DEFAULT_MULTIPLIERS: Record<number, number> = {
  1: 2.0, 2: 1.8, 3: 1.8, 4: 1.6, 5: 1.6, 6: 1.6,
  7: 1.4, 8: 1.4, 9: 1.4, 10: 1.4, 11: 1.0, 12: 1.0,
  13: 1.0, 14: 1.0, 15: 1.0, 16: 1.0, 17: 1.0, 18: 1.0,
  19: 1.0, 20: 1.0
}

export interface ScoreCalculation {
  kills: number
  position: number
  multiplier: number
  finalScore: number
}

export interface TeamStats {
  teamName: string
  teamCode: string
  matches: any[]
  adjustments: any[]
  totalScore: number
  adjustmentTotal: number
  finalScore: number
  rank: number
  totalKills: number
  matchesCount: number
}

/**
 * Calculate score for a single match
 */
export function calculateMatchScore(kills: number, position: number): ScoreCalculation {
  const multiplier = DEFAULT_MULTIPLIERS[position] || 1.0
  const finalScore = kills * multiplier

  return {
    kills,
    position,
    multiplier,
    finalScore
  }
}

/**
 * Calculate team statistics including best matches
 */
export function calculateTeamStats(
  team: any,
  matches: any[],
  adjustments: any[],
  countedMatches: number = 5
): TeamStats {
  // Calculate scores for all matches
  const matchScores = matches.map(match => ({
    ...match,
    scoreCalculation: calculateMatchScore(match.kills, match.position)
  }))

  // Sort by score and take best matches
  const bestMatches = matchScores
    .sort((a, b) => b.scoreCalculation.finalScore - a.scoreCalculation.finalScore)
    .slice(0, countedMatches)

  // Calculate totals
  const totalScore = bestMatches.reduce((sum, match) => sum + match.scoreCalculation.finalScore, 0)
  const totalKills = matches.reduce((sum, match) => sum + match.kills, 0)
  const adjustmentTotal = adjustments.reduce((sum, adj) => sum + adj.points, 0)
  const finalScore = totalScore + adjustmentTotal

  return {
    teamName: team.name,
    teamCode: team.code,
    matches: matchScores,
    adjustments,
    totalScore,
    adjustmentTotal,
    finalScore,
    rank: 0, // Will be set by leaderboard calculation
    totalKills,
    matchesCount: matches.length
  }
}

/**
 * Calculate leaderboard with rankings
 */
export function calculateLeaderboard(teams: TeamStats[]): TeamStats[] {
  return teams
    .sort((a, b) => b.finalScore - a.finalScore)
    .map((team, index) => ({
      ...team,
      rank: index + 1
    }))
}

/**
 * Get position color for styling
 */
export function getPositionColor(position: number): string {
  switch (position) {
    case 1:
      return 'text-leaderboard-gold'
    case 2:
      return 'text-leaderboard-silver'
    case 3:
      return 'text-leaderboard-bronze'
    default:
      return 'text-muted-foreground'
  }
}

/**
 * Get position background class for styling
 */
export function getPositionBackground(position: number): string {
  switch (position) {
    case 1:
      return 'position-1'
    case 2:
      return 'position-2'
    case 3:
      return 'position-3'
    default:
      return 'position-other'
  }
}

/**
 * Validate match submission
 */
export function validateMatchSubmission(position: number, kills: number, files: File[]): { valid: boolean; errors: string[] } {
  const errors: string[] = []
  
  if (position < 1 || position > 20) {
    errors.push('Position must be between 1 and 20')
  }
  
  if (kills < 0) {
    errors.push('Kills cannot be negative')
  }
  
  if (files.length < 2) {
    errors.push('At least 2 evidence files are required')
  }
  
  if (files.length > 5) {
    errors.push('Maximum 5 evidence files allowed')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
>>>>>>> c8e86841b3e7d0cc7fe88e64e28a4359afe2840d

export type ApprovedMatch = { matchNumber: number }
export type ScoreAdjustment = { amount: number }

export function calculateTeamStats(
  matches: ApprovedMatch[] = [],
  adjustments: ScoreAdjustment[] = [],
  scoringProfile: any = {}
) {
  // Minimal placeholder calc: totalScore from adjustments only
  const totalScoreFromAdjustments = adjustments.reduce((sum, a) => sum + (a?.amount ?? 0), 0)
  const gamesPlayed = matches.length
  return {
    totalScore: totalScoreFromAdjustments,
    gamesPlayed
  }
}


// Advanced score calculation system from Warzonedev-main
// Utility for safe and testable score calculations

export interface ScoreCalculationInput {
  kills: number;
  position: number;
  multipliers: Record<number, number>;
  isManual: boolean;
  manualScore?: number;
}

export interface ScoreCalculationResult {
  score: number;
  isValid: boolean;
  errors: string[];
}

/**
 * Calculate score safely and controlled
 * CRITICAL RULE: If isManual=true, use ONLY the provided manualScore
 */
export function calculateScore(input: ScoreCalculationInput): ScoreCalculationResult {
  const errors: string[] = [];
  
  // Input validation
  if (input.kills < 0) {
    errors.push('Kills cannot be negative');
  }
  
  if (input.position < 1 || input.position > 20) {
    errors.push('Position must be between 1 and 20');
  }
  
  if (input.isManual && (input.manualScore === undefined || input.manualScore < 0)) {
    errors.push('Manual score must be specified and non-negative');
  }
  
  if (errors.length > 0) {
    return {
      score: 0,
      isValid: false,
      errors
    };
  }
  
  let score: number;
  
  if (input.isManual && input.manualScore !== undefined) {
    // MANUAL MODE: Use the score entered directly
    score = input.manualScore;
  } else {
    // AUTOMATIC MODE: Calculate with multipliers
    const multiplier = input.multipliers[input.position] || 1;
    score = input.kills * multiplier;
  }
  
  return {
    score: Math.round(score * 10) / 10, // Round to 1 decimal
    isValid: true,
    errors: []
  };
}

/**
 * Validate an array of scores for consistency
 */
export function validateScoreConsistency(scores: ScoreCalculationInput[]): string[] {
  const errors: string[] = [];
  
  // Check duplicate positions
  const positions = scores.map(s => s.position);
  const duplicatePositions = positions.filter((pos, index) => positions.indexOf(pos) !== index);
  
  if (duplicatePositions.length > 0) {
    errors.push(`Duplicate positions found: ${duplicatePositions.join(', ')}`);
  }
  
  // Check position range
  const maxPosition = Math.max(...positions);
  const minPosition = Math.min(...positions);
  
  if (maxPosition > scores.length) {
    errors.push(`Maximum position (${maxPosition}) exceeds number of teams (${scores.length})`);
  }
  
  return errors;
}

/**
 * Warzone Portal scoring system - Position-based multipliers
 */
export const DEFAULT_MULTIPLIERS = {
  1: 2.0, 2: 1.8, 3: 1.8, 4: 1.6, 5: 1.6, 6: 1.6,
  7: 1.4, 8: 1.4, 9: 1.4, 10: 1.4, 11: 1.0, 12: 1.0,
  13: 1.0, 14: 1.0, 15: 1.0, 16: 1.0, 17: 1.0, 18: 1.0,
  19: 1.0, 20: 1.0
};

/**
 * Calculate leaderboard from teams and matches
 */
export function calculateLeaderboard(
  teams: any[],
  matches: any[],
  adjustments: any[] = [],
  countedMatches = 3
) {
  const teamStats: Record<string, any> = {};

  // Initialize team stats
  teams.forEach(team => {
    teamStats[team.code] = {
      teamName: team.name,
      teamCode: team.code,
      matches: [],
      adjustments: [],
      totalScore: 0,
      adjustmentTotal: 0,
      finalScore: 0,
      rank: 0,
      matchesPlayed: 0
    };
  });

  // Add matches
  matches.filter(m => m.status === 'approved').forEach(match => {
    if (teamStats[match.teamCode]) {
      teamStats[match.teamCode].matches.push(match);
      teamStats[match.teamCode].matchesPlayed++;
    }
  });

  // Add adjustments
  adjustments.forEach(adjustment => {
    if (teamStats[adjustment.teamCode]) {
      teamStats[adjustment.teamCode].adjustments.push(adjustment);
    }
  });

  // Calculate scores
  Object.values(teamStats).forEach((team: any) => {
    const sortedScores = team.matches
      .map((match: any) => match.score)
      .sort((a: number, b: number) => b - a)
      .slice(0, countedMatches);
    team.totalScore = sortedScores.reduce((sum: number, score: number) => sum + score, 0);
    team.adjustmentTotal = team.adjustments.reduce((sum: number, adj: any) => sum + adj.points, 0);
    team.finalScore = team.totalScore + team.adjustmentTotal;
  });

  // Sort and assign ranks
  const sorted = Object.values(teamStats)
    .filter((team: any) => team.matches.length > 0 || team.adjustments.length > 0)
    .sort((a: any, b: any) => b.finalScore - a.finalScore);

  sorted.forEach((team: any, index) => {
    team.rank = index + 1;
  });

  return sorted;
}

/**
 * Automatic tests to ensure correctness
 */
export function runScoreCalculationTests(): { passed: boolean; results: string[] } {
  const results: string[] = [];
  let allPassed = true;
  
  // Test 1: Automatic calculation
  const test1 = calculateScore({
    kills: 10,
    position: 1,
    multipliers: { 1: 2.0, 2: 1.8 },
    isManual: false
  });
  
  if (test1.score === 20 && test1.isValid) {
    results.push('✅ Test 1 PASSED: Automatic calculation (10 kills × 2.0 = 20)');
  } else {
    results.push('❌ Test 1 FAILED: Automatic calculation incorrect');
    allPassed = false;
  }
  
  // Test 2: Manual calculation
  const test2 = calculateScore({
    kills: 10,
    position: 1,
    multipliers: { 1: 2.0 },
    isManual: true,
    manualScore: 15.5
  });
  
  if (test2.score === 15.5 && test2.isValid) {
    results.push('✅ Test 2 PASSED: Manual calculation (direct score = 15.5)');
  } else {
    results.push('❌ Test 2 FAILED: Manual calculation not respected');
    allPassed = false;
  }
  
  // Test 3: Error validation
  const test3 = calculateScore({
    kills: -5,
    position: 1,
    multipliers: { 1: 2.0 },
    isManual: false
  });
  
  if (!test3.isValid && test3.errors.length > 0) {
    results.push('✅ Test 3 PASSED: Error validation works');
  } else {
    results.push('❌ Test 3 FAILED: Error validation not working');
    allPassed = false;
  }
  
  return { passed: allPassed, results };
}

// Team code generator utility from Warzonedev-main
// Generates unique team access codes

/**
 * Generate a unique team code
 */
export function generateUniqueTeamCode(existingTeams: Record<string, any> = {}): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const codeLength = 6;
  
  let code: string;
  let attempts = 0;
  const maxAttempts = 1000;
  
  do {
    code = '';
    for (let i = 0; i < codeLength; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    attempts++;
    
    if (attempts >= maxAttempts) {
      throw new Error('Unable to generate unique team code after maximum attempts');
    }
  } while (isCodeExists(code, existingTeams));
  
  return code;
}

/**
 * Check if code already exists
 */
function isCodeExists(code: string, existingTeams: Record<string, any>): boolean {
  return Object.values(existingTeams).some((team: any) => team.code === code);
}

/**
 * Generate multiple unique team codes
 */
export function generateMultipleTeamCodes(count: number, existingTeams: Record<string, any> = {}): string[] {
  const codes: string[] = [];
  const updatedTeams = { ...existingTeams };
  
  for (let i = 0; i < count; i++) {
    const code = generateUniqueTeamCode(updatedTeams);
    codes.push(code);
    // Add to existing teams to avoid duplicates in the same batch
    updatedTeams[code] = { code };
  }
  
  return codes;
}

/**
 * Validate team code format
 */
export function validateTeamCode(code: string): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!code) {
    errors.push('Team code cannot be empty');
  }
  
  if (code.length !== 6) {
    errors.push('Team code must be exactly 6 characters');
  }
  
  if (!/^[A-Z0-9]+$/.test(code)) {
    errors.push('Team code must contain only uppercase letters and numbers');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

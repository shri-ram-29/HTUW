import casesJSON from './pool.json';

export interface CaseChoice {
  text: string;
  outcome: string;
  xp?: number;
}

export interface Case {
  id: number;
  category: string;
  setup: string;
  options: string[];
  outcomes: {
    [key: string]: string;
  };
  xp_range: [number, number];
  rarity: 'common' | 'rare' | 'ultra' | 'boss';
  is_mini_test?: boolean;
  is_boss?: boolean;
  followup_case_id?: number;
}

export const allCases: Case[] = casesJSON as unknown as Case[];

export function getCaseById(id: number): Case | undefined {
  return allCases.find(c => c.id === id);
}

export function getRandomCase(
  excludeIds: number[] = [],
  playerLevel: number = 1,
  lastCategories: string[] = []
): Case {
  // Filter candidates
  const candidates = allCases.filter(c => 
    !excludeIds.includes(c.id)
  );

  if (candidates.length === 0) {
    // If all cases exhausted, reset and pick any
    return allCases[Math.floor(Math.random() * allCases.length)];
  }

  // Calculate weights based on rarity + level
  const weights = candidates.map(c => {
    let baseWeight = {
      'common': 70,
      'rare': 25,
      'ultra': 5,
      'boss': 2
    }[c.rarity] || 50;

    // Increase rare/ultra/boss chance as level increases
    if (playerLevel >= 5 && c.rarity === 'rare') baseWeight += 10;
    if (playerLevel >= 8 && c.rarity === 'ultra') baseWeight += 8;
    
    // Boss fights become more common at higher levels
    if (c.category === 'boss') {
      if (playerLevel >= 5) baseWeight += 5;
      if (playerLevel >= 10) baseWeight += 10;
      if (playerLevel >= 15) baseWeight += 15;
    }

    // Category balance - penalize if same category appeared recently
    const lastTwoCategories = lastCategories.slice(-2);
    if (lastTwoCategories.every(cat => cat === c.category)) {
      baseWeight *= 0.3; // Heavily penalize same category 3 times in a row
    }

    return baseWeight;
  });

  // Weighted random selection
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < candidates.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return candidates[i];
    }
  }

  // Fallback
  return candidates[0];
}

export function calculateXP(
  caseData: Case,
  choiceIndex: number,
  playerLevel: number = 1
): number {
  const [minXP, maxXP] = caseData.xp_range;
  const baseXP = Math.floor(Math.random() * (maxXP - minXP + 1)) + minXP;

  // Parse outcome for XP modifiers (if outcome contains "+X XP" or "-X XP")
  const outcome = caseData.outcomes[(choiceIndex + 1).toString()];
  const xpMatch = outcome?.match(/([+-]\d+)\s*XP/);
  
  if (xpMatch) {
    const modifier = parseInt(xpMatch[1]);
    return Math.max(0, baseXP + modifier);
  }

  return baseXP;
}

export const levelThresholds: { [key: number]: number } = {
  1: 0,
  2: 100,
  3: 250,
  4: 500,
  5: 800,
  6: 1200,
  7: 1700,
  8: 2300,
  9: 3000,
  10: 4000,
  11: 5500,
  12: 7000,
  13: 9000,
  14: 11500,
  15: 14500,
};

export const levelTitles: { [key: number]: string } = {
  1: "Clueless Intern",
  2: "Text Analyzer",
  3: "Emotional Apprentice",
  4: "Sarcasm Detective",
  5: "Mood Whisperer",
  6: "Crisis Manager",
  7: "Peace Negotiator",
  8: "Relationship Engineer",
  9: "Master of Maybes",
  10: "Legend of the Fine",
  11: "Returned Boyfriend",
  12: "Emotional Sage",
  13: "Chaos Survivor",
  14: "Relationship Guru",
  15: "Master of Hearts",
};

export function getLevelFromXP(xp: number): number {
  const levels = Object.keys(levelThresholds).map(Number).sort((a, b) => b - a);
  
  for (const level of levels) {
    if (xp >= levelThresholds[level]) {
      return level;
    }
  }
  
  return 1;
}

export function getXPForNextLevel(currentLevel: number): number {
  return levelThresholds[currentLevel + 1] || levelThresholds[15] + 3000;
}

// Evil Narrator System - Brutal R-rated commentary

export interface NarratorComment {
  text: string;
  type: 'brutal' | 'sarcastic' | 'impressed' | 'savage';
}

// Massive XP Loss (< -30 XP)
const catastrophicFailures = [
  "Holy shit. That was spectacularly wrong.",
  "Congratulations, you just nuked the relationship.",
  "I've seen train wrecks with better outcomes.",
  "Your ex is somewhere laughing. They know.",
  "That wasn't just wrong, that was art.",
  "Statistically speaking, you're the problem.",
  "This is why you're single. This exact moment.",
  "Even I didn't think you'd fuck it up THAT badly.",
  "She's not coming back from that one, chief.",
  "Your therapist is gonna hear about this.",
];

// Big XP Loss (-10 to -30 XP)
const bigFailures = [
  "Oh… you thought that was the right answer? Adorable.",
  "Bold strategy. Terrible execution.",
  "I've seen worse... actually, no I haven't.",
  "Your confidence is inspiring. Your judgment? Not so much.",
  "She's typing... 'We need to talk.' Good job, genius.",
  "That's gonna haunt you at 3 AM.",
  "You really doubled down on stupid, huh?",
  "Congratulations, you unlocked more disappointment!",
  "Maybe try reading the question next time?",
  "This is exactly why she left.",
  "Your dating life makes sense now.",
  "I'm not mad, just... yeah, actually I'm disappointed.",
];

// Small XP Loss (0 to -10 XP)
const smallFailures = [
  "Not great, not terrible. Actually, pretty terrible.",
  "Close! If close meant completely wrong.",
  "You tried. That's... something.",
  "Swing and a miss, buddy.",
  "Better luck next time. You'll need it.",
  "That was almost right. Almost.",
  "Your instincts are broken.",
  "Maybe stick to being single?",
  "She's questioning her choices right now.",
  "Yikes. Just... yikes.",
];

// Low XP Gain (1-20 XP)
const lowWins = [
  "Wow. You got one right. Don't let it go to your head.",
  "Beginner's luck. Don't get cocky.",
  "Finally. I was starting to worry.",
  "A blind squirrel finds a nut sometimes.",
  "Barely acceptable. But I'll take it.",
  "You're still terrible, but slightly less so.",
  "Don't celebrate yet. You're still losing.",
  "One right answer doesn't fix your track record.",
  "She's not impressed. Neither am I.",
  "The bar was low. You barely cleared it.",
];

// Medium XP Gain (21-40 XP)
const mediumWins = [
  "Not bad. For you, anyway.",
  "Okay, that was... acceptable.",
  "You're learning. Slowly. Very slowly.",
  "She's mildly less annoyed. Progress!",
  "I'm almost impressed. Almost.",
  "Keep this up and you might survive.",
  "Finally using that brain of yours.",
  "Decent. Don't fuck it up now.",
  "You're on a roll. Probably gonna fall off soon.",
  "She smiled. Don't ruin it.",
];

// High XP Gain (41+ XP)
const bigWins = [
  "Well damn. Didn't see that coming.",
  "Okay, I'm actually impressed. Slightly.",
  "She's impressed. I'm shocked.",
  "Did you... did you just do something right?",
  "Holy shit, you might actually survive this.",
  "That was... good? What timeline is this?",
  "Keep this energy. You'll need it.",
  "She's reconsidering leaving you. For now.",
  "Alright, alright. You earned that one.",
  "Maybe you're not completely hopeless.",
];

// Boss Fight Comments
const bossFightStart = [
  "Oh good, a boss fight. This should be hilarious.",
  "Final Boss incoming. Spoiler: You lose.",
  "Remember when you thought you were ready? Me too. Good times.",
  "This is where boys become men. Or failures. Probably failures.",
  "She's about to end your whole career.",
  "Your relationship is on the line. No pressure.",
  "This is it. Don't fuck it up. (You will.)",
];

const bossFightWin = [
  "Holy shit. You actually won.",
  "I... I have no words. You did it.",
  "She's staying. I'm shocked.",
  "Against all odds, you didn't fuck it up.",
  "Maybe you're not completely useless.",
  "That was legendary. Don't let it go to your head.",
  "You just saved the relationship. Barely.",
];

const bossFightLoss = [
  "Annnnnd it's over. Relationship status: Dead.",
  "She's gone. I tried to warn you.",
  "That was painful to watch.",
  "You had ONE job. ONE.",
  "Your ex was right about you.",
  "Maybe try therapy?",
  "Single life it is, then.",
];

// Level Up Comments
const levelUpComments = [
  "Level up! You're still clueless, but slightly less so.",
  "New level, same mistakes incoming.",
  "Congrats on leveling up. You're still terrible.",
  "Level {level}? Cute. You're still a disaster.",
  "She's not impressed by your level. Neither am I.",
  "Higher level, same problems.",
  "You leveled up! Your relationship skills? Still trash.",
];

// Achievement Comments
const achievementComments = [
  "An achievement! Too bad it doesn't fix your personality.",
  "Trophy unlocked! She still left you though.",
  "Congrats! This means nothing in real life.",
  "Achievement get! Your ex doesn't care.",
  "Nice trophy. Shame about your dating life.",
];

// Random Taunts (shown occasionally)
const randomTaunts = [
  "Still here? Brave.",
  "Your ex is watching. They're laughing.",
  "This is why you're single.",
  "Maybe try being less... you?",
  "She's out of your league. Way out.",
  "Your mom is disappointed.",
  "This is your life now.",
  "Imagine being this bad at relationships.",
  "You're the villain in her story.",
  "She's telling her friends about this.",
];

// Streak Comments
const streakComments = [
  "3 in a row! Don't mess it up... oh wait, you will.",
  "Impressive streak. Shame it's about to end.",
  "You're on fire! (Your relationship, that is.)",
  "Streak going strong. For now.",
  "Don't get cocky. Pride comes before the fall.",
];

// Get random comment from array
const getRandom = (arr: string[]): string => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// Main function to get narrator comment
export const getNarratorComment = (
  xpGained: number,
  isBossFight: boolean = false,
  isLevelUp: boolean = false,
  isAchievement: boolean = false,
  currentLevel?: number
): NarratorComment | null => {
  // 50% chance to show narrator comment
  if (Math.random() > 0.5) return null;

  let text: string;
  let type: NarratorComment['type'] = 'sarcastic';

  // Boss fight comments (always show)
  if (isBossFight) {
    if (xpGained > 50) {
      text = getRandom(bossFightWin);
      type = 'impressed';
    } else if (xpGained < 0) {
      text = getRandom(bossFightLoss);
      type = 'savage';
    } else {
      text = getRandom(bossFightStart);
      type = 'brutal';
    }
    return { text, type };
  }

  // Level up comments
  if (isLevelUp && currentLevel) {
    text = getRandom(levelUpComments).replace('{level}', currentLevel.toString());
    type = 'sarcastic';
    return { text, type };
  }

  // Achievement comments
  if (isAchievement) {
    text = getRandom(achievementComments);
    type = 'sarcastic';
    return { text, type };
  }

  // XP-based comments
  if (xpGained < -30) {
    text = getRandom(catastrophicFailures);
    type = 'savage';
  } else if (xpGained < -10) {
    text = getRandom(bigFailures);
    type = 'brutal';
  } else if (xpGained < 0) {
    text = getRandom(smallFailures);
    type = 'brutal';
  } else if (xpGained <= 20) {
    text = getRandom(lowWins);
    type = 'sarcastic';
  } else if (xpGained <= 40) {
    text = getRandom(mediumWins);
    type = 'sarcastic';
  } else {
    text = getRandom(bigWins);
    type = 'impressed';
  }

  return { text, type };
};

// Get random taunt (for occasional use)
export const getRandomTaunt = (): string => {
  return getRandom(randomTaunts);
};

// Get streak comment
export const getStreakComment = (): string => {
  return getRandom(streakComments);
};

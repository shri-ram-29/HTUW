export interface Choice {
  text: string;
  outcome: string;
  xp: number;
  achievement?: string;
}

export interface Scenario {
  id: number;
  title: string;
  situation: string;
  choices: Choice[];
}

// Tutorial scenarios - First 5 cases for training mode
export const scenarios: Scenario[] = [
  {
    id: 1,
    title: 'Chapter 1: "She said she\'s fine."',
    situation: 'You texted: "You okay?"\nShe replies: "I\'m fine."',
    choices: [
      {
        text: "Okay, cool.",
        outcome: "You failed. She wasn't fine.",
        xp: 0,
      },
      {
        text: "Are you sure?",
        outcome: "She says yes. Still not fine.",
        xp: 5,
      },
      {
        text: "What did I do wrong?",
        outcome: "Now you're getting warmer. But still freezing.",
        xp: 10,
      },
      {
        text: "Buy her food.",
        outcome: "You did well, knight of chicken biryani. 🥇",
        xp: 50,
        achievement: "Emotional Archaeologist: Tried to dig for meaning.",
      },
    ],
  },
  {
    id: 2,
    title: 'Chapter 2: "Do what you want."',
    situation: 'She said this casually while glaring at your soul.',
    choices: [
      {
        text: "Do what you want.",
        outcome: "Brave, but foolish.",
        xp: 0,
      },
      {
        text: "Ask again.",
        outcome: "She repeats it louder.",
        xp: 5,
      },
      {
        text: "Apologize for something random.",
        outcome: "Worked. She's confused now.",
        xp: 30,
      },
      {
        text: "Pretend the Wi-Fi died.",
        outcome: "Genius. You live to see another day.",
        xp: 50,
        achievement: "Diplomatic Retreat: Knew when to vanish.",
      },
    ],
  },
  {
    id: 3,
    title: 'Chapter 3: "She\'s choosing a restaurant."',
    situation: 'She says, "You pick anything."',
    choices: [
      {
        text: "Pizza?",
        outcome: "No.",
        xp: 0,
      },
      {
        text: "Chinese?",
        outcome: "No.",
        xp: 0,
      },
      {
        text: "What do you want then?",
        outcome: "I said anything!",
        xp: 5,
      },
      {
        text: "Fine, let's starve.",
        outcome: "You earned sarcasm resistance +10.",
        xp: 40,
        achievement: "Food Philosopher: Discovered hunger transcends logic.",
      },
    ],
  },
  {
    id: 4,
    title: 'Chapter 4: "Her Birthday is Tomorrow."',
    situation: "You forgot last year. Don't mess this up.",
    choices: [
      {
        text: "Buy flowers.",
        outcome: "Cute, but basic.",
        xp: 10,
      },
      {
        text: "Buy a bag.",
        outcome: "She already has 14.",
        xp: 5,
      },
      {
        text: "Ask what she wants.",
        outcome: "She says 'nothing.' You fool.",
        xp: 0,
      },
      {
        text: "Handwrite a note.",
        outcome: "Tears. Emotions. Victory.",
        xp: 50,
        achievement: "Romantic Archaeologist: Unearthed emotions from ancient text.",
      },
    ],
  },
  {
    id: 5,
    title: 'Chapter 5: "The Final Training."',
    situation: "She's angry but says it's not about you.\nSpoiler: it's about you.",
    choices: [
      {
        text: "Ask if it's about you.",
        outcome: "She says no. It is.",
        xp: 5,
      },
      {
        text: "Hug her.",
        outcome: "She melts a little. But still mad.",
        xp: 20,
      },
      {
        text: "Blame the universe.",
        outcome: "Smart. Blame accepted.",
        xp: 30,
      },
      {
        text: "Bring coffee.",
        outcome: "Training complete. You're ready for chaos.",
        xp: 50,
        achievement: "Emotional Engineer: Applied caffeine diplomacy.",
      },
    ],
  },
];

# How to Understand Women - Game Documentation

## 📖 Table of Contents
1. [Game Overview](#game-overview)
2. [Game Flow](#game-flow)
3. [Features](#features)
4. [Technical Architecture](#technical-architecture)
5. [Game Mechanics](#game-mechanics)
6. [UI Components](#ui-components)
7. [File Structure](#file-structure)

---

## 🎮 Game Overview

**"How to Understand Women"** is an interactive comedy game about relationships. Players navigate through various relationship scenarios, making choices that affect their XP, level, and achievements. The game features a brutal, sarcastic narrator that provides R-rated commentary on player decisions.

### Theme
- **Style**: Retro 8-bit gaming aesthetic
- **Tone**: Dark comedy, sarcastic, brutally honest
- **Colors**: Purple/Pink primary, Red for destructive, Green for success
- **Font**: Monospace (retro terminal style)

---

## 🎯 Game Flow

### 1. Homepage (`/`)
- **Multi-step introduction** with swipe/arrow navigation
- **Two game modes**:
  - **Start Training** → 5-case tutorial
  - **Infinite Mode** → Skip directly to endless gameplay

### 2. Training Mode (`/game`)
- **5 tutorial cases** to learn the basics
- No results page after completion
- Tracks XP and achievements
- Redirects to transition screen

### 3. Transition Screen (`/transition`)
- Shows training completion stats
- Displays **random intimidating phrases** (12 variations)
- Shows XP earned during training
- Button to enter Infinite Mode after 3-second delay

### 4. Infinite Mode (`/infinite`)
- **161 cases** from pool.json
- Random weighted case selection
- XP/Level progression system
- Achievement tracking
- **Evil narrator commentary**
- Session-based progress with lifetime stats
- Exit shows session summary

---

## ✨ Features

### 🎲 Case Selection System
**File**: `lib/casePool.ts`

- **161 total cases** organized by category
- **Categories**: texting, food, mood, birthday, social, arguments, random, boss
- **Rarity levels**: common (70%), rare (25%), ultra (5%), boss (2%)
- **Anti-repeat system**: Remembers last 20 cases
- **Category balancing**: Prevents same category 3 times in a row
- **Level-based weighting**: Higher levels = more rare cases

#### Boss Fights
- **1 boss case** (Case #161)
- Spawn rate increases with level:
  - Level 5+: ~10% chance
  - Level 10+: ~20% chance
  - Level 15+: ~30% chance
- Higher XP rewards (100-200 XP)
- Special narrator comments

---

### 📊 Progression System

#### XP & Levels
**File**: `lib/casePool.ts`

- **15 levels total** with exponential XP requirements
- **Level titles** (humorous):
  - Level 1: "Clueless Intern"
  - Level 5: "Mood Whisperer"
  - Level 10: "Legend of the Fine"
  - Level 15: "Relationship Sensei"

**XP Calculation**:
```typescript
Base XP = case.xp_range[0] to case.xp_range[1]
Modifiers from outcome text:
- "perfect" / "legendary" → +20 XP
- "good" / "great" → +10 XP
- "disaster" / "catastrophic" → -20 XP
- "wrong" / "terrible" → -10 XP
```

#### Session vs Lifetime Stats
**Session Stats** (resets on exit):
- Session XP
- Session Level (starts at 1)
- Cases survived this session

**Lifetime Stats** (never reset):
- Total XP earned across all sessions
- Highest level reached
- Total cases survived
- Achievements (permanent)

**Storage**: `localStorage` key: `infinite_mode_lifetime`

---

### 🏆 Achievement System
**File**: `app/infinite/page.tsx`

**Milestone Achievements**:
- 🎯 First Step: Complete 1 case
- 💪 Survivor: Complete 10 cases
- 🔥 Veteran: Complete 25 cases
- 👑 Legend: Complete 50 cases

**Level Achievements**:
- ⚡ Mood Whisperer: Reach Level 5
- 🌟 Legend of the Fine: Reach Level 10

**Category Achievements**:
- 🍕 Crisis Feeder: Solve 5 food cases
- 📱 Text Master: Survive 5 texting cases
- 🛡️ Argument Survivor: Survive 5 argument cases

**Special Achievements**:
- 💀 Boss Survivor: Survive a boss fight
- 💎 Ultra Rare: Encounter an ultra rare case

**XP Achievements**:
- 💰 XP Collector: Earn 1000 total XP
- 💎 XP Master: Earn 2500 total XP

**Display**: Animated popup (3 seconds) with trophy icon

---

### 😈 Evil Narrator System
**File**: `lib/narrator.ts`

#### Overview
A brutal, sarcastic narrator that comments on player choices with R-rated humor. Creates a "rage at the narrator, not the game" dynamic.

#### Comment Categories (200+ lines)

**Catastrophic Failures** (< -30 XP):
- "Holy shit. That was spectacularly wrong."
- "Congratulations, you just nuked the relationship."
- "This is why you're single. This exact moment."

**Big Failures** (-10 to -30 XP):
- "Oh… you thought that was the right answer? Adorable."
- "Statistically speaking, you're the problem."
- "Congratulations, you unlocked more disappointment!"

**Small Failures** (0 to -10 XP):
- "Not great, not terrible. Actually, pretty terrible."
- "Your instincts are broken."
- "Yikes. Just... yikes."

**Low Wins** (1-20 XP):
- "Wow. You got one right. Don't let it go to your head."
- "A blind squirrel finds a nut sometimes."
- "You're still terrible, but slightly less so."

**Medium Wins** (21-40 XP):
- "Not bad. For you, anyway."
- "I'm almost impressed. Almost."
- "Keep this up and you might survive."

**Big Wins** (41+ XP):
- "Well damn. Didn't see that coming."
- "Did you... did you just do something right?"
- "Maybe you're not completely hopeless."

**Boss Fight Comments**:
- Start: "Oh good, a boss fight. This should be hilarious."
- Win: "Holy shit. You actually won."
- Loss: "She's gone. I tried to warn you."

**Level Up Comments**:
- "Level up! You're still clueless, but slightly less so."
- "New level, same mistakes incoming."

#### Display Logic
- **50% random chance** to show narrator comment
- **Color-coded by severity**:
  - 🔴 Red (savage/brutal): Failures
  - 🟢 Green (impressed): Big wins
  - 🟡 Yellow (sarcastic): Normal
- **Skull icon** 💀 next to comments
- **Animated entrance** (slides down)
- Shows **above** outcome text

---

### 📱 Session Summary Modal

Appears when player clicks **EXIT** button.

#### Display Sections

**This Session**:
- XP Earned
- Level Reached
- Cases Survived

**All-Time Stats**:
- Total XP
- Highest Level
- Total Cases

**Achievements**:
- Total trophies unlocked

#### Actions
1. **❌ Close (X button)**: Continue current session
2. **Play Again**: Reset session to Level 1
3. **Home**: Return to homepage

---

## 🎨 UI Components

### Progress Bar
- Shows current level progress
- XP display: "105 / 150 XP"
- Level title displayed
- Mobile: Stacks vertically
- Desktop: Horizontal layout

### Stats Bar (Top Right)
- **XP Badge**: Purple border, shows session XP
- **Level Badge**: Accent color, shows current level
- **Trophy Badge**: Secondary color, shows achievement count
- **Layout**: Horizontal on all screen sizes
- **Position**: Aligned with EXIT button

### Case Card
- **Border**: 4px primary color
- **Case number** and **category badge**
- **Boss fights**: Red pulsing badge "💀 BOSS FIGHT"
- **Setup text**: Scenario description
- **4 choice buttons**: A, B, C, D with hover effects

### Outcome Screen
1. **Narrator Comment** (if triggered):
   - Skull icon
   - Color-coded border and text
   - Italic bold quote
2. **Outcome Text**:
   - Accent border
   - Shows result of choice
3. **XP Gained**:
   - Green for positive XP
   - Red for negative XP
   - Lightning bolt icon
4. **Next Case Button**:
   - Full width
   - Primary border

### Popups

**Achievement Popup**:
- Top center position
- Trophy icon
- Achievement name
- 3-second display
- Animated entrance/exit

**Level Up Popup**:
- Full screen overlay
- Pulsing flame icon
- "LEVEL UP!" text
- New level number and title
- 4-second display

---

## 🗂️ File Structure

```
how-to-understand-women/
├── app/
│   ├── page.tsx                 # Homepage with intro
│   ├── game/page.tsx            # Training mode (5 cases)
│   ├── transition/page.tsx      # Transition screen
│   ├── infinite/page.tsx        # Infinite mode (main game)
│   ├── layout.tsx               # Root layout with metadata
│   └── globals.css              # Global styles
│
├── lib/
│   ├── scenarios.ts             # 5 training cases
│   ├── pool.json                # 161 infinite mode cases
│   ├── casePool.ts              # Case selection & XP logic
│   └── narrator.ts              # Evil narrator system
│
├── public/
│   └── favicon.svg              # 8-bit pixel heart icon
│
└── components/
    └── ui/                      # shadcn/ui components
        ├── button.tsx
        └── progress.tsx
```

---

## 🎲 Game Mechanics

### Case Selection Algorithm

```typescript
1. Filter out last 20 played cases (anti-repeat)
2. Calculate weights based on:
   - Rarity (common: 70, rare: 25, ultra: 5, boss: 2)
   - Player level (higher level = more rare cases)
   - Category balance (penalize if same category 3x in a row)
3. Weighted random selection
4. Return selected case
```

### XP Calculation Flow

```typescript
1. Get base XP from case.xp_range
2. Apply outcome text modifiers:
   - Positive keywords → bonus XP
   - Negative keywords → penalty XP
3. Calculate new total XP
4. Update session XP
5. Update lifetime XP
6. Check for level up
7. Generate narrator comment (50% chance)
8. Display outcome with XP
```

### Achievement Checking

```typescript
1. After each choice, check:
   - Case count milestones (1, 10, 25, 50)
   - Level milestones (5, 10)
   - Category streaks (5+ same category)
   - Boss fight completion
   - Ultra rare case encounter
   - XP milestones (1000, 2500)
2. If new achievement → unlock and show popup
3. Save to localStorage (permanent)
```

---

## 🎨 Design System

### Colors
```css
--primary: Purple/Pink
--secondary: Cyan/Blue
--accent: Yellow/Orange
--destructive: Red
--muted: Gray
```

### Typography
- **Font**: Monospace (Geist Mono)
- **Sizes**: xs (0.75rem) to 3xl (1.875rem)
- **Weight**: Normal to Bold
- **Style**: Uppercase for headers, italic for narrator

### Spacing
- **Mobile**: Reduced padding (px-3, py-1.5)
- **Desktop**: Standard padding (px-4, py-2)
- **Gaps**: 2-4 units between elements

### Animations
- **Framer Motion** for all animations
- **Entrance**: Fade + slide/scale
- **Exit**: Reverse entrance
- **Durations**: 0.3s (fast), 0.5s (normal), 4s (popups)

---

## 🔧 Technical Details

### State Management
- **React useState** for component state
- **localStorage** for persistence
- **useEffect** for initialization and side effects

### Routing
- **Next.js 14 App Router**
- Client-side navigation with `Link`
- Search params for data passing (`?xp=100`)

### Styling
- **TailwindCSS** for utility classes
- **shadcn/ui** for base components
- **Responsive**: Mobile-first approach
- **Dark mode**: Default theme

### Performance
- **Code splitting**: Automatic with Next.js
- **Lazy loading**: AnimatePresence for conditional renders
- **Optimized images**: SVG for favicon

---

## 📝 Case Pool Structure

**File**: `lib/pool.json`

```json
{
  "id": 1,
  "category": "texting",
  "setup": "She texts 'K.'",
  "options": [
    "Panic",
    "Ask if she's okay",
    "Send meme",
    "Wait"
  ],
  "outcomes": {
    "1": "Overthinking begins. -10 XP.",
    "2": "She says 'I'm fine.' +20 XP.",
    "3": "She laughs. Crisis averted. +30 XP.",
    "4": "Silence. The worst outcome."
  },
  "xp_range": [10, 30],
  "rarity": "common"
}
```

**Fields**:
- `id`: Unique case identifier (1-161)
- `category`: Case type (texting, food, mood, etc.)
- `setup`: Scenario description
- `options`: Array of 4 choices
- `outcomes`: Object with results for each choice (1-4)
- `xp_range`: [min, max] XP for this case
- `rarity`: common, rare, ultra, or boss
- `is_boss`: Optional boolean for boss fights

---

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm start
```

---

## 🎯 Key Features Summary

✅ **Two Game Modes**: Training (5 cases) + Infinite (161 cases)  
✅ **Session-Based Progress**: Reset sessions, keep lifetime stats  
✅ **Evil Narrator**: 200+ brutal R-rated comments  
✅ **Achievement System**: 15+ unlockable trophies  
✅ **Boss Fights**: Rare, high-stakes encounters  
✅ **Level Progression**: 15 levels with humorous titles  
✅ **Smart Case Selection**: Anti-repeat, category balance, rarity weighting  
✅ **Mobile Responsive**: Optimized for all screen sizes  
✅ **Retro Aesthetic**: 8-bit pixel art, monospace fonts, retro colors  
✅ **Persistent Stats**: localStorage for lifetime tracking  
✅ **Animated UI**: Smooth transitions and popups  

---

## 📞 Support

For issues or questions, refer to the code comments or check the implementation in the respective files.

**Version**: 1.0  
**Last Updated**: November 2025  
**Framework**: Next.js 14 + React + TypeScript + TailwindCSS

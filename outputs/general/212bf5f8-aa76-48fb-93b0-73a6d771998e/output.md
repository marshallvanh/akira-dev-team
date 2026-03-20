# TETSUO

# What I Understood

You want to build SchoolBuilder in playable stages so your son can use it early and watch it grow. Smart approach — keeps him engaged and gives you real feedback fast.

---

# Mode

**BUILD PLANNING MODE** — Breaking MVP into playable stages

---

# Playable Stages

Each stage is a working app your son can actually play. Not just "backend done" — actual game he can touch.

---

## Stage 1: Quiz Core (Week 1-2)

**What your son gets:**
- Opens app
- Picks an avatar from presets
- Enters his name
- Chooses Math
- Plays a 10-question quiz
- Sees his score at the end
- Earns points

**What's NOT in Stage 1:**
- No reading mode yet
- No shop yet
- No friends yet
- No streaks yet
- Points display but nothing to spend them on

**Why this first:**
He can play immediately. Core loop works. You validate the quiz feels fun.

---

## Stage 2: Rewards (Week 2-3)

**What gets added:**
- Avatar shop opens
- Spend points on hats, colors, backgrounds
- Equipped items show on avatar
- Points now matter

**What your son experiences:**
"I answered questions, earned coins, bought a cool hat."

**Why this second:**
Gives points a purpose. Creates the earn-spend loop that drives engagement.

---

## Stage 3: Reading Mode (Week 3-4)

**What gets added:**
- Reading option on home screen
- Story passages appear
- App reads aloud with word highlighting
- Comprehension questions after
- Earn points for reading too

**What your son experiences:**
"I can do math OR reading. The app reads to me and I answer questions about the story."

**Why this third:**
Second subject doubles the content. Listen Mode is achievable without complex speech APIs.

---

## Stage 4: Progress + Streaks (Week 4-5)

**What gets added:**
- Daily streak tracker
- Streak bonuses (extra points for consecutive days)
- Badges for milestones
- Simple progress screen showing stats

**What your son experiences:**
"I've played 5 days in a row! I got a badge!"

**Why this fourth:**
Habit formation. Now he wants to come back every day.

---

## Stage 5: Friends + Leaderboard (Week 5-6)

**What gets added:**
- 6-digit friend code displayed on profile
- Add friend by entering their code
- Weekly leaderboard showing friends
- Leaderboard shows avatar + name + score

**What your son experiences:**
"I added my friend! I'm beating him this week!"

**Why this fifth:**
Social competition. Now he wants to play more to stay on top.

---

## Stage 6: Polish + Parent Gate (Week 6-7)

**What gets added:**
- Parent T&C acceptance on first launch
- Difficulty scaling within grade
- More avatar items
- More questions and passages
- Bug fixes from real usage

**What your son experiences:**
"Game feels smoother. More stuff to buy. Questions aren't too easy anymore."

**Why this last:**
Polish comes after core is validated. Parent gate added before you share with other families.

---

# Stage Summary

| Stage | What He Can Do | Timeframe |
|-------|----------------|-----------|
| **1** | Play math quiz, earn points | Week 1-2 |
| **2** | Buy avatar items with points | Week 2-3 |
| **3** | Play reading mode with read-aloud | Week 3-4 |
| **4** | Track streaks, earn badges | Week 4-5 |
| **5** | Add friends, compete on leaderboard | Week 5-6 |
| **6** | Parent gate, polish, more content | Week 6-7 |

---

# What Your Son Sees Each Week

| Week | His Experience |
|------|----------------|
| **1-2** | "Dad made me a math game!" |
| **2-3** | "I can buy stuff now!" |
| **3-4** | "It reads stories to me!" |
| **4-5** | "I got a streak badge!" |
| **5-6** | "I'm beating my friend!" |
| **6-7** | "It's getting harder and there's more stuff!" |

---

# Build Order for Stage 1

Here's what gets built first:

```
Stage 1: Quiz Core
│
├── SCREENS
│   ├── Onboarding: Avatar picker
│   ├── Onboarding: Name entry
│   ├── Onboarding: Grade selection
│   ├── Home: Subject selection (Math only enabled)
│   ├── Quiz: Question display
│   ├── Quiz: Answer feedback (correct/wrong)
│   └── Results: Score + points earned
│
├── BACKEND
│   ├── Players table (Supabase)
│   ├── Quiz results table
│   ├── Math questions table (seeded)
│   └── Anonymous auth
│
├── LOGIC
│   ├── Generate quiz (10 random questions for grade)
│   ├── Score calculation
│   ├── Points calculation
│   └── Save result to database
│
└── ASSETS
    ├── Avatar presets (8-10 options)
    └── Math questions (50+ for his grade to start)
```

---

# Three Questions Before I Hand to Architect

| # | Question | Why It Matters |
|---|----------|----------------|
| **1** | What grade is your son in? | I'll prioritize that grade's content first |
| **2** | Does he have a device to test on? (iOS or Android?) | Affects how I set up builds |
| **3** | Do you want me to generate the math questions now, or do you want to provide some? | Need content to make Stage 1 playable |

Once you answer, I'll hand this to Architect to spec Stage 1 in full detail, then we start building.

What's your call?

---

# RESEARCH

# Research Report: Stage-Based Progression for SchoolBuilder

---

## 1. Research Question

How should SchoolBuilder implement stage-based progression so Marshall's son can play early builds, see progress, and stay engaged while the app is still being developed?

---

## 2. Options Considered

| Option | Description |
|--------|-------------|
| **A. Linear Level Unlock** | Complete Level 1 to unlock Level 2, etc. Simple and clear. |
| **B. XP + Level System** | Earn XP from any activity. Level up at thresholds (100 XP = Level 2, 250 XP = Level 3). |
| **C. World/Stage Map** | Visual map with stages. Complete a stage to unlock the next area. Like Mario or Prodigy. |
| **D. Daily/Weekly Challenges** | No strict levels. Progress comes from completing rotating challenges. |
| **E. Hybrid: Map + XP** | World map for visual progress, XP for rewards within stages. Best of both. |

---

## 3. Comparison and Tradeoffs

| Factor | Linear Unlock | XP System | World Map | Daily Challenges | Hybrid (Map + XP) |
|--------|---------------|-----------|-----------|------------------|-------------------|
| **Visual progress** | Low | Medium | High | Low | High |
| **Kid engagement** | Medium | Medium | High | Medium | High |
| **Build in stages** | Easy | Easy | Medium | Easy | Medium |
| **Flexibility** | Low | High | Medium | High | High |
| **Complexity to build** | Low | Low | Medium | Low | Medium |
| **Industry standard** | Common | Common | Prodigy, Mario, most kid games | Duolingo-style | Best practice |

**Key insight from research:** Prodigy Math (the most successful kid learning game) uses a world map with quests and XP. Kids who played 2-3 times weekly for 25-30 minutes improved test scores by up to 23 percentile points. The visual map + progression combo is proven.

---

## 4. Risks and Gotchas

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Building a map takes time** | Delays your son playing | Start with simple linear stages. Add visual map later. |
| **Too many levels = overwhelming** | Kid doesn't know where to start | Keep it simple: 3-5 stages per subject initially |
| **Progress feels slow** | Kid loses interest | Frequent small rewards + visible XP bar |
| **Locked content frustrates** | Kid wants to skip ahead | Allow replaying completed stages for bonus points |
| **No content for later stages yet** | Kid hits a wall | Mark future stages as "Coming Soon" with teaser |

---

## 5. Recommendation

**Start with Option A (Linear Level Unlock), designed to evolve into Option E (Hybrid Map + XP).**

Here's why this works for your situation:

### Phase 1: Playable Now (2-3 weeks)

```
MATH
├── Stage 1: Addition Adventure (10 questions)
├── Stage 2: Subtraction Safari (locked until Stage 1 complete)
├── Stage 3: Coming Soon...

READING
├── Stage 1: The Fox and the Grapes (1 story + 5 questions)
├── Stage 2: The Tortoise and the Hare (locked until Stage 1 complete)
├── Stage 3: Coming Soon...
```

Your son plays Stage 1 immediately. Completing it unlocks Stage 2. He sees "Coming Soon" for future stages — builds anticipation.

### Phase 2: Add XP Layer (Week 4-5)

- Every correct answer = 10 XP
- Streak bonus = extra XP
- XP bar visible on home screen
- Level up at thresholds (Level 1 → 2 at 100 XP, etc.)
- Levels unlock avatar shop items

### Phase 3: Add Visual Map (Later)

- Replace linear list with illustrated world map
- Each stage is a location on the map
- Path shows completion progress
- This is polish, not essential for engagement

---

## Implementation for Staged Development

| Build | What Your Son Can Play | What You're Building Next |
|-------|------------------------|---------------------------|
| **Build 1** | Stage 1 Math + Stage 1 Reading | Basic quiz flow, points, T&C gate |
| **Build 2** | Stages 1-2 both subjects | Avatar selection, display name |
| **Build 3** | Stages 1-3 both subjects | XP system, level progression |
| **Build 4** | Stages 1-5 both subjects | Avatar shop, badges |
| **Build 5** | Full MVP | Friend codes, leaderboards |

Each build is playable. Your son tests while you build the next piece.

---

## What Makes This Work (From Research)

| Finding | Source | How We Apply It |
|---------|--------|-----------------|
| Kids improve 23% with 2-3 plays per week | Legends of Learning | Design for short, repeatable sessions |
| Prodigy's RPG progression drives engagement | Prodigy Game | Stage unlock + XP mirrors this model |
| Visual progress matters more than points alone | Multiple sources | "Coming Soon" stages show the journey ahead |
| 25-30 min sessions optimal | Research | 10-question rounds = ~5 min each, 5-6 rounds per session |

---

## 6. Sources

1. Prodigy Game — prodigygame.com (progression and engagement model)
2. Legends of Learning — legendsoflearning.com (research on frequency and outcomes)
3. Education.com — education.com/resources/games (leveled game structure)
4. Kong Academy — kongacademy.org (growth mindset through progression)
5. Tree House Schoolhouse — treehouseschoolhouse.com (board game progression patterns)

---

# Summary

| Question | Answer |
|----------|--------|
| **What structure?** | Linear stage unlock, evolving to map + XP |
| **How many stages to start?** | 2-3 per subject (playable in Build 1-2) |
| **How does he see progress?** | Stages unlock, XP bar fills, levels increase |
| **Can you build it incrementally?** | Yes — each build is playable, adds features |
| **What keeps him coming back?** | Unlocking next stage, earning XP, leveling up, avatar rewards |

---

# Next Step

Do you want me to lock this progression system into the SchoolBuilder architecture and produce Build 1 scope — the minimum playable version your son can test in 2-3 weeks?
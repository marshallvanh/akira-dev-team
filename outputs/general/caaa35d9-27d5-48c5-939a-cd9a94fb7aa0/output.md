# TETSUO

Got it. Adding SchoolBuilder as your second active project.

---

# Project: SchoolBuilder

| Field | Value |
|-------|-------|
| **Type** | Educational mobile game |
| **Target** | Kids aged 8–12 (Grade 3 to Grade 6) |
| **Status** | Brainstorm |

---

# What I Need From You

Before I can shape this into something buildable, I need answers to these:

| Question | Why It Matters |
|----------|----------------|
| **What subject(s)?** | Math? Reading? Science? Coding? General curriculum? |
| **What's the game part?** | Quiz? Adventure? Building/simulation? Puzzle? Collection? |
| **Solo or competitive?** | Single-player progression? Leaderboards? Multiplayer? |
| **Curriculum-aligned?** | Follow Australian curriculum? Or general skill-building? |
| **Who's it for?** | Just your son? Or planning to release publicly? |
| **Platform?** | iOS? Android? Both? |
| **Monetization?** | Free forever? Subscription? Ads? Paid app? |

---

# Quick Reaction

Pick the concept closest to what you're imagining:

| Option | Description |
|--------|-------------|
| **A** | Quiz Arena — answer questions, earn points, unlock stuff |
| **B** | Build-a-School — answer questions to earn resources, build your school |
| **C** | Adventure RPG — explore a world, solve problems to progress |
| **D** | Daily Challenge — short sessions, streaks, badges |
| **E** | Something else — tell me |

---

Give me whatever you've got. Even rough ideas. We'll shape it together.

---

# RESEARCH

# Research Report: Educational Mobile Game for Kids (8–12)

**Project:** SchoolBuilder
**Requested by:** Marshall
**Date:** Current

---

## 1. Research Question

What's the best approach to build an educational mobile game for kids aged 8–12 (Grade 3–6) that runs on iOS and Android?

Sub-questions:
- What frameworks work best for this type of app?
- What do successful kids' educational games look like?
- What game mechanics actually work for this age group?

---

## 2. Options Considered

### Frameworks

| Framework | Type | Language | Best For |
|-----------|------|----------|----------|
| **React Native + Expo** | Cross-platform | TypeScript | Apps with some gamification, not heavy games |
| **Flutter** | Cross-platform | Dart | Vibrant animated UIs, single codebase |
| **Unity** | Game engine | C# | Real games with physics, sprites, game loops |
| **Godot** | Game engine | GDScript | 2D games, completely free, no royalties |
| **No-code (Andromo, Base44)** | Drag-and-drop | None | Quick prototypes, simple apps |

### Competitor Apps in This Space

| App | Subject Focus | Age Range | Model | What Works |
|-----|---------------|-----------|-------|------------|
| **Prodigy Math** | Math | 6–14 | Freemium | RPG wrapper around curriculum, parent dashboard |
| **Minecraft: Education Edition** | STEM, coding | 8+ | Subscription | Open-world building, collaborative |
| **Kahoot! Kids** | Multi-subject quizzes | 6–12 | Free + IAP | Multiplayer, competitive |
| **Learn Isle** | Math, English | 6–12 | Subscription | AI-personalized, AR elements |
| **ABCmouse** | Full curriculum | 2–8 | Subscription | Progress tracking, 850+ lessons |

### Game Mechanics That Work for Ages 8–12

| Mechanic | Why It Works | Example |
|----------|--------------|---------|
| **Points and rewards** | Immediate feedback, goal achievement | Earn coins for correct answers |
| **Badges and unlockables** | Recognition, collection instinct | Unlock characters, items, areas |
| **Progress tracking** | Visual goals, sense of advancement | Climb a mountain, build a school |
| **Leaderboards** | Competition, social comparison | Weekly class rankings |
| **Collaborative challenges** | Teamwork, peer learning | Group quests |

Research shows moderate-to-large cognitive gains when these mechanics are combined with curriculum content.[1]

---

## 3. Comparison and Tradeoffs

### Framework Decision

| Factor | React Native | Flutter | Unity | Godot |
|--------|--------------|---------|-------|-------|
| **You know it** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Built for games** | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **Animation/physics** | Clunky | Good | Excellent | Excellent |
| **Asset store** | Limited | Limited | Massive | Growing |
| **Learning curve** | None | Medium | Medium | Low-Medium |
| **Cross-platform** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Cost** | Free | Free | Free (royalty >$100k) | Free forever |

**The real question:** How "gamey" is SchoolBuilder?

- If it's **quiz-based with gamification** (points, badges, progress bars) → **React Native works**
- If it's **an actual game** (characters moving, puzzles, building mechanics) → **Unity or Godot**

### Game Model Decision

| Model | Engagement | Learning Depth | Dev Complexity |
|-------|------------|----------------|----------------|
| **Quiz Arena** | Medium | High (direct practice) | Low |
| **Build-a-School** | High | Medium (rewards-driven) | Medium |
| **Adventure RPG** | Very High | Medium (embedded learning) | High |
| **Daily Challenge** | Medium | High (habit-forming) | Low |

**What competitors prove:** The Prodigy model wins. Wrap curriculum in a game kids actually want to play. Learning happens inside gameplay, not as a separate "lesson" mode.

---

## 4. Risks and Gotchas

### Regulatory — This Is Non-Negotiable

| Regulation | Requirement | Consequence |
|------------|-------------|-------------|
| **COPPA (US)** | No data collection without verifiable parental consent | Fines up to $50k per violation |
| **App Store Kids Category** | No external links, no behavioral ads, no account creation without parent gate | App rejection |
| **GDPR-K (EU)** | Age gates, parental consent flows | Fines, removal from stores |

**Bottom line:** If you collect any user data, you need a parent consent flow. Safest path is offline-first with optional cloud sync behind a parent gate.

### Technical

| Risk | Impact | Mitigation |
|------|--------|------------|
| **React Native hits walls for games** | Janky animations, no physics | Use it only if game mechanics are simple |
| **Unity learning curve** | 2–4 weeks to get productive | Budget time, use asset store heavily |
| **Kids churn fast** | Lose interest in days | Progression systems, unlockables, content updates |

### Market

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Crowded market** | Hard to stand out | Niche down — specific subject, specific hook |
| **Parents buy, kids use** | Must appeal to both | Game for kids, progress reports for parents |
| **"Educational" often means boring** | Kids abandon it | Make the game genuinely fun first, learning second |

### Ethical

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Dark patterns in kids' apps** | 80% of kids' apps use manipulative tactics | Don't. Parents notice. Reviews tank. |
| **Addictive mechanics** | Backlash, regulation | Time limits, natural stopping points, parent controls |

---

## 5. Recommendation

### Framework: Depends on Game Style

**If SchoolBuilder is quiz-based with gamification:**
→ Use **React Native + Expo**. You know it. It's fast. It works.

**If SchoolBuilder has real game mechanics (building, characters, puzzles):**
→ Use **Unity**. It's the industry standard. Asset store saves weeks. C# is close enough to TypeScript.

**My lean:** Based on the name "SchoolBuilder" and your mention of a building mechanic, this sounds like a real game. **Use Unity.**

---

### Game Model: Hybrid Build + Learn

Combine two proven mechanics:

1. **Building mechanic** — Kids answer questions to earn resources, then build and customize their school
2. **Quest/progression** — Unlock new buildings, areas, characters as they advance

This gives you:
- Intrinsic motivation (building is fun)
- Extrinsic motivation (unlocks, progress)
- Learning embedded in gameplay (answer to earn)
- Parent appeal (visible progress, curriculum alignment)

---

### Subject Focus: Start with Math

| Why Math | Evidence |
|----------|----------|
| Most proven market | Prodigy has 100M+ users |
| Easiest to gamify | Right/wrong answers, clear progression |
| Parents actively seek it | Math anxiety is real, parents want help |
| Curriculum is universal | Grade 3–6 math is similar everywhere |

You can add reading, science, etc. later. Start narrow.

---

### Monetization: Freemium with Subscription

| Tier | What They Get | Price |
|------|---------------|-------|
| **Free** | First area, limited buildings, basic features | $0 |
| **Premium** | All content, no ads, parent dashboard, unlimited building | $4.99/month or $29.99/year |

No in-app purchases for items. No loot boxes. No manipulative tactics.

---

## 6. Sources

1. PMC Study on Game-Based Learning in Elementary Education — https://pmc.ncbi.nlm.nih.gov/articles/PMC11018941/
2. Learn Isle — Top Educational Games 2024 — https://www.learnisle.net/post/top-7-educational-games-for-kids-in-2024
3. TutoClub — Best Mobile Games for Kids — https://tutoclub.com/blog/best-mobile-games-for-kids
4. Kodable — Gamification in Elementary Education — https://www.kodable.com/learn/gamification-in-elementary-education
5. Boddlelearning — Why Gamified Learning Works — https://www.boddlelearning.com/article/why-gamified-learning-works-k6-classrooms
6. Alpha Software — How to Build a Children's App — https://www.alphasoftware.com/how-to-build-a-childrens-app

---

## Next Steps

| Decision | My Recommendation | Your Call |
|----------|-------------------|-----------|
| **Framework** | Unity (if building mechanic is real) | Confirm game style |
| **Subject** | Math first | Confirm or change |
| **Model** | Build-a-school + quests | Confirm or change |
| **Monetization** | Freemium subscription | Confirm or change |

Once you confirm these, Tetsuo can shape the technical architecture and we can move to Phase 1.

What's your call, Marshall?
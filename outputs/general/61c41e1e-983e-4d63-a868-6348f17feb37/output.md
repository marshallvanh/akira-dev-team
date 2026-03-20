# TETSUO

Good. Two active projects now.

---

# Project: SchoolBuilder

**Type:** Educational mobile game
**Target:** Kids aged 8–12 (Grade 3 to Grade 6)

---

# What I Need to Shape This

| Question | Why It Matters |
|----------|----------------|
| **What subject(s)?** | Math only? Reading? Science? All core subjects? |
| **What's the "game" part?** | Quiz game? Building/simulation? Adventure? Puzzle? Collection/rewards? |
| **Competitive or solo?** | Leaderboards, multiplayer, or single-player progression? |
| **Curriculum-aligned?** | Follow Australian curriculum? Or general skill-building? |
| **Monetization?** | Free for your son? Planning to release publicly? Ads, paid, freemium? |
| **Platform?** | iOS, Android, or both? |

---

# Quick Concepts to React To

Tell me which of these feels closest to what you're imagining:

| Concept | Description |
|---------|-------------|
| **A — Quiz Arena** | Answer questions to earn points, unlock characters, climb ranks |
| **B — Build-a-School** | Answer questions to earn resources, build and customize a virtual school |
| **C — Adventure RPG** | Explore a world, solve problems to progress, story-driven |
| **D — Daily Challenge** | Short daily sessions, streaks, badges, habit-focused |
| **E — Something else** | Tell me what's in your head |

---

# Also

Is this primarily for your son, or are you thinking bigger — something you'd release to other parents/kids?

That changes how we scope it.

---

Go ahead. React to the concepts or just tell me what you're picturing.

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
- How do you monetize without being predatory?

---

## 2. Options Considered

### Game Development Frameworks

| Framework | Language | Learning Curve | 2D Suitability | Cost |
|-----------|----------|----------------|----------------|------|
| **React Native + Expo** | TypeScript | Low (you know it) | Moderate | Free |
| **Unity** | C# | Medium | Excellent | Free (royalty above $100k) |
| **Godot** | GDScript (Python-like) | Low-Medium | Excellent | Free, open source |
| **Flutter** | Dart | Medium | Moderate | Free |
| **Phaser** | JavaScript | Low | Good (web-first) | Free |

### Educational Game Models

| Type | Examples | What Kids Like | What Parents Like |
|------|----------|----------------|-------------------|
| **Quest/Adventure** | Poptropica, Prodigy | Story, characters, exploration | Subjects hidden in gameplay |
| **Puzzle/Logic** | Thinkrolls, Monument Valley | Challenge, satisfaction | Problem-solving, no ads |
| **Creative/Sandbox** | Toca Life, Minecraft | Freedom, building | Imagination, open-ended |
| **Drill/Practice** | Khan Academy, Coolmath | Rewards, competition | Direct curriculum alignment |
| **Hybrid** | Prodigy Math | RPG + math problems | Visible progress reports |

### Monetization Models

| Model | How It Works | Parent Trust | Revenue Potential |
|-------|--------------|--------------|-------------------|
| **Freemium** | Free core, paid extras | Medium | High |
| **Subscription** | Monthly/yearly access | High | High (recurring) |
| **One-time purchase** | Pay once, own forever | Highest | Low-Medium |
| **Ad-supported** | Free with ads, pay to remove | Low-Medium | Medium |
| **In-app purchases** | Buy items/content | Low (risky) | High but ethically fraught |

---

## 3. Comparison and Tradeoffs

### Framework Choice

**React Native/Expo:**
- ✅ You already know it (Tradie OS uses it)
- ✅ Single codebase for iOS/Android
- ✅ Fast iteration
- ❌ Not designed for games — animations and game loops are clunky
- ❌ No built-in physics, sprite handling, or game engine features

**Unity:**
- ✅ Industry standard for mobile games
- ✅ Massive asset store (characters, sounds, UI kits)
- ✅ Built for games — physics, animations, particle effects
- ✅ Excellent 2D support
- ❌ New language (C#) and new IDE
- ❌ Steeper learning curve

**Godot:**
- ✅ Completely free, no royalties ever
- ✅ Lightweight, fast to learn
- ✅ GDScript is Python-like (beginner friendly)
- ✅ Great for 2D games
- ❌ Smaller community than Unity
- ❌ Fewer ready-made assets

### Game Model Choice

For 8–12 year olds:
- **Quest/Adventure** keeps them engaged longer
- **Puzzle/Logic** builds skills but can feel like homework
- **Hybrid (Prodigy model)** works best — game wrapper around learning content

### Monetization Choice

For kids' apps:
- **Subscription** is the cleanest — parents pay, kids play without interruption
- **In-app purchases** are a minefield — regulations (COPPA), angry parents, ethical concerns
- **Ads** work but must be non-intrusive and at natural breaks only

---

## 4. Risks and Gotchas

### Regulatory

| Risk | Impact | Mitigation |
|------|--------|------------|
| **COPPA compliance** (US) | Fines up to $50k per violation | No data collection without parental consent, no behavioral ads |
| **App Store Kids Category** | Strict review, can reject app | No external links, no ads in Kids category, no account creation without parent gate |
| **GDPR-K** (EU) | Similar to COPPA | Age gates, parental consent flows |

### Technical

| Risk | Impact | Mitigation |
|------|--------|------------|
| **React Native not suited for games** | Janky animations, poor performance | Use a real game engine if game mechanics are core |
| **Unity learning curve** | Slower initial development | Budget 2–4 weeks to learn basics |
| **Cross-platform bugs** | Different behavior iOS vs Android | Test on real devices early and often |

### Market

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Crowded market** | Hard to stand out | Niche down (specific subject, specific age, specific hook) |
| **Parents are the buyer, kids are the user** | Must appeal to both | Game for kids, progress reports for parents |
| **Kids churn fast** | Lose interest quickly | Content updates, unlockables, progression systems |

### Ethical

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Dark patterns** | 80% of kids' apps use manipulative tactics | Don't. Parents notice. Reviews tank. |
| **Addictive mechanics** | Backlash, regulation | Time limits, natural stopping points, parent controls |

---

## 5. Recommendation

### Framework: **Unity**

Even though you know React Native, this is a game. Unity is purpose-built for:
- Sprite animation
- Physics
- Game loops
- Sound/music
- Cross-platform mobile export

Learning curve is real but manageable. C# is similar enough to TypeScript that you'll adapt. The asset store alone will save you weeks.

**Alternative:** If you want to stay in familiar territory and the "game" is really more of an interactive quiz app, stick with React Native + Expo. But if there's any real game mechanics (characters moving, puzzles, physics), use Unity.

---

### Game Model: **Hybrid Quest + Learning**

Follow the Prodigy model:
- Wrap curriculum (math, reading, whatever) in an adventure game
- Kid plays the game, learning happens inside it
- Progress is visible to parents

Your son is 8. Build something he'd actually want to play. Then sneak the learning in.

---

### Monetization: **Freemium with optional subscription**

| Tier | What They Get | Price |
|------|---------------|-------|
| **Free** | First world/chapter, basic features | $0 |
| **Premium** | All content, no ads, parent dashboard | $4.99/month or $29.99/year |

No in-app purchases for items. No manipulative tactics. Parents will pay for quality — they're desperate for good educational games that aren't predatory.

---

### First Decision Needed

Before we go further:

**What subject or skill should SchoolBuilder focus on?**

Options:
- Math (most proven market)
- Reading/literacy
- Coding/logic
- General curriculum (harder to execute well)
- Something else your son specifically needs

Pick one. We'll shape the game around it.

---

## 6. Sources

1. Family Education — Free Educational Apps for Kids
2. RevenueCat — Monetizing Kids Apps
3. Game Biz Consulting — Ad Monetization in Kids Games
4. Stoke Ventures — Cross-Platform Mobile Game Development
5. Elite Game Developers — Investing in Education Apps for Kids
6. App Radar — Mobile Game Engines and Platforms

---

## Next Steps

1. **You decide:** What subject? What's the hook?
2. **I research:** Specific curriculum alignment, competitor deep-dive
3. **Tetsuo shapes:** Technical architecture for Unity + mobile
4. **Architect designs:** Game structure, progression system, screens

Ball's in your court, Marshall. What's this game actually teaching?
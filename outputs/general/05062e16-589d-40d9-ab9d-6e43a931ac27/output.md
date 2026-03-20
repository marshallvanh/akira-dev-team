# TETSUO

Good answers. Let me respond to each.

---

# Your Decisions

| Decision | Your Answer | My Take |
|----------|-------------|---------|
| **Subject** | Math and Reading | Good combo. Math is easy to gamify. Reading adds depth. Start with math, add reading in Phase 2. |
| **Game style** | Quiz arena with rewards | Smart. Lower dev complexity. React Native can handle this. |
| **Scope** | Son first, then friends | Perfect MVP scope. Build for one kid, expand if it works. |
| **Privacy** | Kids see only avatar + name, even you can't see personal data | This is the right call. I'll design around this. |

---

# Framework Decision

You asked what I think.

**My recommendation: React Native + Expo**

Here's why:

| Factor | Unity | React Native |
|--------|-------|--------------|
| **Game style** | Overkill for quiz arena | Built for this |
| **You know it** | No — 2-4 weeks to learn | Yes — already using it for Tradie OS |
| **Two projects** | Different codebases, different skills | Same stack, shared learnings |
| **Dev speed** | Slower initially | Fast |
| **Animations** | Excellent | Good enough for quiz + rewards |
| **Physics/sprites** | Excellent | Not needed for quiz arena |

A quiz arena with rewards doesn't need Unity. You're not building Minecraft. You're building:
- Questions appear
- Kid answers
- Points/rewards animate
- Progress unlocks stuff

React Native handles that fine. And you're not splitting your brain across two completely different tech stacks.

**Use Unity later** if you want to add a building mechanic or adventure mode. For now, stay in Expo.

---

# Privacy Architecture

This is the part I want to get exactly right.

| Principle | Implementation |
|-----------|----------------|
| **No personal data stored** | No real names, no emails, no birthdates, no photos |
| **Avatar + display name only** | Kid picks avatar and nickname at setup |
| **No parent visibility into other kids** | You see your son's progress. You see leaderboard names/avatars. That's it. |
| **No kid-to-kid messaging** | Leaderboard only. No chat. No friend requests. No social features. |
| **Local-first** | Progress stored on device. Optional cloud sync behind parent gate. |
| **COPPA-safe by design** | No data collection that triggers COPPA requirements |

When friends join:
- Each kid has their own device
- Each kid picks avatar + nickname
- Leaderboard shows avatars + nicknames only
- No way to identify real kids from the data

---

# Questions Before Architecture

| Question | Why It Matters |
|----------|----------------|
| **How do friends compete?** | Same leaderboard? Invite codes? Or just parallel play (no competition)? |
| **Curriculum-aligned?** | Australian curriculum Grade 3-6? Or general skill levels? |
| **Content source** | Do I generate questions? Do you want to input them? Pull from an API? |
| **Session length** | Quick 5-minute bursts? Or longer 15-20 minute sessions? |

---

# What I'm Thinking

A simple, tight MVP:

```
SchoolBuilder MVP
├── Kid picks avatar + nickname
├── Chooses Math or Reading
├── Quiz rounds (5-10 questions)
├── Earn points + coins
├── Unlock new avatars, themes, titles
├── Leaderboard (avatar + name only)
└── Parent gate for any settings/sync
```

No accounts. No emails. No servers initially. Just a clean local app that's fun and teaches.

---

# Next Step

Answer the four questions above, then I'll hand this to Architect to design the full structure.

Or if you want to move faster — tell me to make the calls and I'll shape it with sensible defaults.

Your call, Marshall.

---

# RESEARCH

# Research Report: SchoolBuilder — Privacy-First Educational Quiz Game

**Project:** SchoolBuilder
**Requested by:** Marshall
**Date:** Current

---

## 1. Research Question

How do we build a math and reading quiz game for kids (Grade 3–6) that:
- Uses a rewards system to keep them engaged
- Protects privacy so rigorously that even Marshall can't see personal data
- Starts with his son, then expands to friends
- Only shows avatars and display names — nothing else

---

## 2. Options Considered

### Privacy Architecture Models

| Model | How It Works | Privacy Level |
|-------|--------------|---------------|
| **A — No accounts at all** | Device-only data, no sync, no friends | Maximum — but no multiplayer possible |
| **B — Anonymous accounts** | Random ID + avatar + display name only. No email, no real name, no parent data stored. | Very high — friends can play together |
| **C — Pseudonymous with parent gate** | Parent creates account with email, child only sees avatar/name. Parent can view own child only. | High — adds parent dashboard |
| **D — Full accounts (Prodigy model)** | Email, name, school, grade collected. Parent consent required. | Moderate — COPPA compliant but more data |

### Reward System Models

| Model | Mechanics | Engagement | Complexity |
|-------|-----------|------------|------------|
| **Points + Shop** | Earn points, buy avatar items/backgrounds | High | Medium |
| **Badges + Collection** | Unlock badges for achievements | Medium | Low |
| **Building/Unlock** | Earn resources, build something (school, world) | Very High | Medium-High |
| **Leaderboards** | Compete with friends on weekly scores | High (social) | Low |

### Competitor Privacy Approaches

| App | Data Collected | What Kids See | Parent Access |
|-----|----------------|---------------|---------------|
| **Khan Academy Kids** | None beyond device | Avatar, progress | None (no accounts) |
| **PBS Kids** | None | Character selection | None |
| **Prodigy** | Pseudonymous ID, grade, parent email | Avatar, username, friends | Dashboard with child's progress |
| **Toca Life** | None | Avatar/characters | None |

---

## 3. Comparison and Tradeoffs

### Privacy Model Decision

| Factor | No Accounts (A) | Anonymous (B) | Pseudonymous + Parent Gate (C) |
|--------|-----------------|---------------|-------------------------------|
| **Friends can play together** | ❌ No | ✅ Yes | ✅ Yes |
| **Marshall sees son's progress** | ❌ No | ❌ No | ✅ Yes (own child only) |
| **Even Marshall can't see other kids' data** | ✅ Yes | ✅ Yes | ✅ Yes |
| **COPPA compliance** | ✅ Trivial | ✅ Easy | ✅ Requires consent flow |
| **Data breach risk** | None | Minimal | Low |
| **Multiplayer/social** | ❌ No | ✅ Yes | ✅ Yes |

**Your stated requirement:** "Personal information concealed even from me. All we should see is their avatar and their name."

This points to **Model B — Anonymous accounts** as the cleanest fit.

### How Anonymous Accounts Would Work

| Component | Implementation |
|-----------|----------------|
| **Account creation** | Device generates random UUID. No email. No real name. |
| **Display name** | Child picks a name (filtered for inappropriate words) |
| **Avatar** | Child customizes from preset options |
| **Friend connections** | Share a 6-digit friend code. No search by name. |
| **Data stored** | UUID, display name, avatar config, quiz scores, rewards earned |
| **Data NOT stored** | Real name, email, location, age, school, parent info |
| **What Marshall sees** | His son's avatar, display name, scores (on son's device only) |
| **What friends see** | Each other's avatars, display names, leaderboard position |
| **What server knows** | Anonymous IDs and scores — can't link to real people |

### Reward System Decision

For your son's age (8) and the quiz arena format:

| System | Fit for Age 8–12 | Fit for Quiz Arena | Recommendation |
|--------|------------------|-------------------|----------------|
| **Points + Avatar Shop** | ✅ Excellent | ✅ Excellent | **Use this** |
| **Building mechanic** | ✅ Good | ⚠️ Adds complexity | Save for v2 |
| **Badges** | ✅ Good | ✅ Good | Add alongside points |
| **Leaderboards** | ✅ Good (with friends) | ✅ Good | Add for friend groups |

**Recommendation:** Points + Avatar Shop as primary. Badges as secondary. Friend leaderboards as social layer.

---

## 4. Risks and Gotchas

### Privacy Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Display names reveal identity** | Kids type their real name | Filter + warn. Suggest fun names. Review first-time entries. |
| **Friend codes shared publicly** | Strangers join friend groups | Codes expire after 24 hours. Max 10 friends. |
| **Device access = account access** | Sibling/friend plays as wrong child | Optional PIN to open app (parent sets) |
| **You accidentally build data collection** | COPPA violation | Don't collect anything you don't need. No analytics that track individuals. |

### Technical Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Offline-first adds sync complexity** | Conflicts when friends compare scores | Server is source of truth for leaderboards. Device is source of truth for progress. |
| **Quiz content needs to scale** | Run out of questions quickly | Start with 500+ questions per grade per subject. Add more over time. |
| **Reward balance is hard** | Too easy = boring. Too hard = frustrating. | Playtest with your son. Adjust earn rates based on feedback. |

### Legal/Compliance Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **COPPA applies even without accounts** | If you collect ANY personal info, you need consent | Collect nothing personal. Anonymous IDs only. |
| **App Store Kids Category rules** | No external links, no behavioral ads, strict review | No ads. No links. No account creation in traditional sense. |
| **Friend feature could be seen as "social"** | Some stores restrict social features in kids apps | Friend codes only (no chat, no messaging, no search) |

### Expansion Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Friends want features you haven't built** | Pressure to add chat, etc. | Decide now: no chat, ever. Leaderboards and friend codes only. |
| **Parents want dashboards** | Model B doesn't support this | If demand is high, add Model C as optional upgrade later |

---

## 5. Recommendation

### Privacy Model: Anonymous Accounts (Model B)

This is exactly what you asked for:
- No personal data collected
- Even you can't see other kids' info
- Friends play together via codes
- Each child sees only: avatar, display name, scores, rewards

**Implementation:**
- Device generates UUID on first launch
- Child picks display name (filtered) and avatar
- All data syncs to server under UUID only
- Friend connections via 6-digit codes (expire in 24 hours)
- No parent accounts needed for MVP

---

### Reward System: Points + Shop + Badges

| Component | How It Works |
|-----------|--------------|
| **Points** | Earn 10 points per correct answer. Bonus for streaks. |
| **Shop** | Spend points on avatar items (hats, colors, backgrounds, pets) |
| **Badges** | Unlock for milestones (100 questions, 10-streak, subject mastery) |
| **Leaderboards** | Weekly scores among friends only. Resets each Monday. |

---

### Subject Approach: Math + Reading

| Subject | Question Types | Grade 3–6 Coverage |
|---------|----------------|-------------------|
| **Math** | Addition, subtraction, multiplication, division, fractions, word problems | Core curriculum aligned |
| **Reading** | Comprehension passages, vocabulary, fill-in-the-blank, sentence order | General literacy skills |

Start with 200 questions per subject per grade level. Expand based on what your son burns through fastest.

---

### Framework: React Native + Expo

This is a quiz app with gamification, not a physics-based game. You know React Native. Use it.

| Component | Tech |
|-----------|------|
| **App** | Expo + React Native |
| **Backend** | Supabase (same as Tradie OS — you'll know the patterns) |
| **Auth** | Anonymous auth (Supabase supports this natively) |
| **Database** | Postgres via Supabase |
| **Offline** | SQLite for local progress, sync when online |

---

### Data Model (Privacy-First)

```
players
├── id (UUID, auto-generated)
├── display_name (string, filtered)
├── avatar_config (JSON)
├── points_balance (integer)
├── created_at (timestamp)

quiz_results
├── id
├── player_id (UUID)
├── subject (math/reading)
├── grade_level (3-6)
├── correct_count
├── total_count
├── completed_at

friendships
├── player_id_1 (UUID)
├── player_id_2 (UUID)
├── created_at

rewards_owned
├── player_id (UUID)
├── reward_id (string)
├── purchased_at
```

**What's NOT stored:** Real names, emails, ages, locations, schools, parent info, device IDs, IP addresses.

---

## 6. Sources

1. TeachThought — 15 COPPA-Compliant Early Education Apps — https://www.teachthought.com/technology/15-early-education-apps-that-are-coppa-compliant/
2. KidsNetGuard — Privacy Protection in Educational Apps — https://kidsnetguard.com/en/2024/07/15/privacy-protection-in-educational-apps-a-guide-for-parents-and-educators/
3. Countly — Data Privacy in Kids Apps — https://countly.com/blog/data-privacy-kids-apps
4. TermsFeed — Privacy Guidelines for Apps for Children — https://www.termsfeed.com/blog/privacy-guidelines-apps-children/
5. Edutopia — Effective Rewards in Game-Based Learning — https://www.edutopia.org/blog/effective-rewards-game-based-learning-vicki-davis
6. LittleLit — Best AI Apps for Kids to Learn Safely — https://www.littlelit.ai/post/best-artificial-intelligence-app-for-kids-to-learn-safely

---

## Summary for Marshall

| Decision | Recommendation |
|----------|----------------|
| **Privacy model** | Anonymous accounts — UUID + display name + avatar only |
| **What you can see** | Your son's progress on his device. Nothing about his friends except their avatar and name on leaderboards. |
| **What friends can see** | Each other's avatars, display names, weekly scores |
| **What server stores** | Anonymous IDs and scores — can't link to real people |
| **Subjects** | Math + Reading |
| **Rewards** | Points → Avatar Shop. Badges for milestones. Friend leaderboards. |
| **Framework** | React Native + Expo + Supabase (same stack as Tradie OS) |
| **Expansion path** | Friends join via 6-digit codes. No chat. No messaging. Just play and compete. |

---

## Next Step

Confirm this direction and I'll hand off to Tetsuo to shape the technical architecture.

**Questions for you:**

1. Does anonymous accounts (no parent dashboard) work for you? Or do you want to see your son's progress in a parent view?
2. Friend codes that expire in 24 hours — good? Or should they last longer?
3. Any subjects beyond math and reading you want from day one?
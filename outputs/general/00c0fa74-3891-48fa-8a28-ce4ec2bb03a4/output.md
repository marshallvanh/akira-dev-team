# TETSUO

Excellent additions. Let me break down what you've given me.

---

# Updated Decisions

| Decision | Your Answer | My Take |
|----------|-------------|---------|
| **Parent gate** | Accept T&C before kids play | Smart. Legal protection + parental awareness. One-time gate on first launch. |
| **Names** | First name or username only. No surname. | Good. Reduces identifiable data. Filter for inappropriate words. |
| **Friend codes** | You didn't want expiry — just avatar + name | Got it. I'll simplify. Friends see each other on leaderboard. No code system needed initially. |
| **Subjects** | Math and Reading | Locked. |
| **Reading mode** | App reads aloud OR kid reads back with speech recognition tracking | This is a significant feature. Let me break it down. |

---

# The Reading Feature

What you're describing is called **read-along speech tracking**. This is genuinely impressive when done well.

| Mode | How It Works |
|------|--------------|
| **App reads to kid** | Text-to-speech reads the story. Words highlight as spoken. Kid follows along. |
| **Kid reads to app** | Microphone listens. Speech recognition matches words. Words highlight as kid reads. App detects if they're stuck or mispronounce. |

### Technical Reality Check

| Component | Difficulty | Notes |
|-----------|------------|-------|
| **Text-to-speech (app reads)** | Easy | Expo Speech API handles this natively |
| **Word-by-word highlighting** | Medium | Need to sync timing with audio |
| **Speech recognition (kid reads)** | Medium-Hard | Need real-time transcription |
| **Word-matching as kid reads** | Hard | Compare spoken words to expected text in real-time |
| **Detecting mispronunciation** | Very Hard | Requires phoneme-level analysis |

### My Recommendation

**Phase 1:** App reads aloud with word highlighting. This is achievable and valuable.

**Phase 2:** Kid reads back with speech tracking. This needs more research into speech recognition APIs that work well with children's voices (they're notoriously harder to recognize than adult speech).

| API Option | Accuracy with Kids | Cost | Offline |
|------------|-------------------|------|---------|
| **Google Speech-to-Text** | Good | Pay per use | No |
| **Azure Speech Services** | Good + pronunciation assessment | Pay per use | No |
| **Whisper (OpenAI)** | Good | Free (self-hosted) or API cost | Yes (self-hosted) |
| **expo-speech-recognition** | Moderate | Free | Device-dependent |

**Honest assessment:** Kid read-back with real-time tracking is a feature that companies spend millions on (see Reading Eggs, Raz-Kids). We can build a basic version, but don't expect perfection in v1.

---

# Game Additions Worth Considering

You asked for ideas. Here's what would make SchoolBuilder stronger:

| Addition | What It Does | Complexity | Recommendation |
|----------|--------------|------------|----------------|
| **Daily streak** | Bonus rewards for playing consecutive days | Low | ✅ Add in v1 |
| **Difficulty scaling** | Questions get harder as kid improves | Medium | ✅ Add in v1 |
| **Timed challenges** | Beat the clock for bonus points | Low | ✅ Add in v1 |
| **Story mode** | Reading passages are part of a continuing story | Medium | ✅ Add in v1 — keeps kids coming back |
| **Multiplayer quiz battles** | Real-time head-to-head with friend | High | ❌ Save for v2 |
| **Parent progress reports** | Weekly email/notification to parent | Medium | ⚠️ Optional — adds data collection |
| **Achievements showcase** | Kids can display badges on profile | Low | ✅ Add in v1 |
| **Sound effects + animations** | Celebrations for correct answers | Medium | ✅ Essential for engagement |
| **Hint system** | Spend coins to get a hint | Low | ✅ Add in v1 |
| **Review mode** | Practice questions they got wrong | Low | ✅ Add in v1 |

---

# Revised Feature Set

## SchoolBuilder MVP (v1)

### Core
- Parent accepts T&C on first launch (one-time gate)
- Kid creates profile: avatar + first name/username only
- Choose subject: Math or Reading

### Math Mode
- Quiz rounds (10 questions)
- Difficulty scales with performance
- Timed challenge option
- Earn points per correct answer
- Streak bonuses

### Reading Mode
- Story passages (age-appropriate, continuing narrative)
- App reads aloud with word-by-word highlighting
- Comprehension questions after passage
- Vocabulary challenges

### Rewards
- Points → Avatar shop (hats, colors, pets, backgrounds)
- Badges for milestones
- Daily streak tracker
- Achievements showcase on profile

### Social
- Friend leaderboard (avatar + name only)
- Weekly scores reset Monday

### Future (v2)
- Kid reads back with speech tracking
- Multiplayer quiz battles
- Parent progress dashboard
- More subjects (science, spelling)

---

# Questions Before I Lock Architecture

| Question | Why It Matters |
|----------|----------------|
| **1. T&C gate — just a checkbox or actual terms they scroll through?** | Determines how much legal text you need written |
| **2. Story content — do you want AI-generated stories or pre-written?** | AI = infinite content but needs review. Pre-written = controlled quality but limited. |
| **3. How do friends find each other?** | If no friend codes, do they share a "room name"? Or just local play (same device)? |
| **4. Offline-first or online-required?** | Can kids play without internet? |

---

# Technical Feasibility Summary

| Feature | Feasible in React Native? | Notes |
|---------|---------------------------|-------|
| Parent T&C gate | ✅ Yes | Simple modal on first launch |
| Avatar + name setup | ✅ Yes | Standard UI |
| Math quizzes | ✅ Yes | Core app functionality |
| Reading passages | ✅ Yes | Text rendering + comprehension |
| Text-to-speech | ✅ Yes | Expo Speech API |
| Word highlighting sync | ✅ Yes | Needs custom timing logic |
| Speech recognition (kid reads) | ⚠️ Partial | Works but accuracy varies with kids |
| Real-time word tracking | ⚠️ Hard | Possible but complex |
| Points + shop | ✅ Yes | Standard state management |
| Leaderboards | ✅ Yes | Supabase query |
| Offline play | ✅ Yes | SQLite local storage |

---

# My Recommendation

**Lock the MVP without speech recognition for reading.**

Add "app reads aloud" in v1. Add "kid reads back" in v2 once we've researched the best speech API for children's voices.

This keeps your scope manageable and gets a working app in your son's hands faster.

---

# Next Step

Answer the four questions above, then I'll hand this to Architect for full technical design.

Or tell me to make sensible defaults and I'll lock it myself.

Your call, Marshall.

---

# BACKEND

Great updates, Marshall. Let's refine this based on your feedback.

---

# Updated Decisions

## 1. Parent Consent and Terms

- **Parent Gate:** Before a child can play, the parent must accept terms and conditions.
- **How It Works:** App launches, shows terms screen. Parent taps to accept, app unlocks for child.
- **Data Collection:** Store parent's confirmation as a boolean (no personal data).

## 2. Friend Avatars and Names

- **Avatar and Display Name Only:** Child chooses an avatar and a display name. No surnames.
- **Name Restrictions:** Validate to prevent inappropriate words. Suggest fun names.

## 3. Subjects

- **Math and Reading Only:** Start with these two, then expand later.

## 4. Reading Aloud and Listening Feature

- **App Reads Aloud:** Option for the app to read passages to the child.
- **Read-Along Feature:** Child reads back aloud; microphone listens and highlights words as they're spoken correctly.

---

# Revised Features Based on Your Feedback

## Core Features

- **Avatar + Display Name:** Kid picks avatar and a display name (no surnames).
- **Parent Consent:** Parent accepts terms before the app unlocks.
- **Math and Reading Quizzes:** Core subjects for quizzes.
- **Rewards System:** Points, avatar shop, badges for milestones.
- **Friend Leaderboards:** Shows avatars and display names only.

## New Features

- **Reading Aloud:** App can read passages aloud to the child.
- **Mic Listening & Highlighting:** As the child reads aloud, the app listens and highlights text in real-time.

---

# Technical Considerations

## Framework: React Native + Expo

Handles the quiz game and reading aloud feature efficiently.

## Speech Recognition

### Options for Reading Aloud and Listening:

- **Expo Speech**: Use Expo's built-in Text-to-Speech API for reading aloud.
- **Speech-to-Text API**: Use a service like Google's Cloud Speech-to-Text to handle real-time reading analysis.

### Implementation Steps:

1. **Text-to-Speech**: Implement using Expo's TTS module.
2. **Speech-to-Text**: Send audio snippets to an external service for processing.
3. **Highlighting Logic**: Compare returned text with the passage, highlight correctly spoken words.

## Privacy Measures

- **Anonymous Accounts**: No personal data collection.
- **Terms Acceptance**: Store a simple boolean for terms acceptance — no personal info.
- **Voice Data**: Processed in real-time; do not store recordings.

---

# Next Steps

1. **Confirm the updated feature set**: Let me know if this aligns with your vision.
2. **Lock the architecture**: I'll work with Architect to finalize the technical design.
3. **Decide on build order**: Choose whether to start with Tradie OS or SchoolBuilder.

---

# Questions for You

1. **Terms Text**: Do you have specific terms, or should I draft a standard template?
2. **Speech APIs**: Are you okay with relying on Google Cloud for speech processing, or do you prefer another service?
3. **Build Order**: Which project do you want to kick off first?

Let me know how you'd like to proceed!

---

# FRONTEND

Great clarifications, Marshall. Let me break this down into actionable steps.

---

# Your Input

| Question | Your Answer |
|----------|-------------|
| **1. Parent's role** | Parents accept terms and conditions before kids play |
| **2. Friend codes** | Clarification — no codes needed, just avatar and display/username (no surnames) |
| **3. Subjects** | Math and Reading for now |
| **4. Reading feature** | Option for app to read aloud, and microphone to listen/highlight as kids read back |

---

# Updated Plan

## 1. Parent Acceptance

### Implementation
- **Flow:** Parent sees terms and conditions on first launch
- **Action:** Must accept before child can create an account
- **Storage:** Acceptance stored locally (no server-side parent data)

### Why
Ensures compliance and aligns with your preference for parental oversight.

## 2. Usernames and Avatars

### Implementation
- **Usernames:** Only given names or creative usernames allowed (filtered for bad words)
- **Avatars:** Choose from preset options
- **Friend Mechanic:** No codes needed — friends see avatars and usernames on leaderboards

### Why
Simplifies the system. No need for friend codes if there's no deeper social feature.

## 3. Reading Feature

### Implementation
- **Read Aloud:** App uses Text-to-Speech (TTS) to read passages
- **Read Back:** App uses microphone to listen to child reading
  - **Speech-to-Text (STT):** Highlights words as the child reads
- **Tech:** Expo Audio + Speech API for TTS, Expo Speech API for STT

### Why
Enhances engagement. Supports kids who learn better by listening. Interactive reading aids comprehension.

## 4. Subjects

- **Math:** Core curriculum-focused questions
- **Reading:** Passages with read aloud/interactive reading

### Why
Focus on quality. Start with these, expand later.

---

# Additional Ideas

Here are some additions to consider:

### 1. Daily Challenges

- **Details:** 5-question daily quiz
- **Rewards:** Extra points for streaks
- **Why:** Encourages daily practice, builds habits

### 2. Story Mode for Reading

- **Details:** Unlock chapters by completing quizzes
- **Why:** Narrative motivation. Kids want to see what happens next.

### 3. Parent Dashboard

- **Details:** Optional parent email to track child's progress
- **Why:** Future-friendly. Gives parents insight if desired later.

### 4. Adaptive Difficulty

- **Details:** Questions get harder/easier based on performance
- **Why:** Keeps kids challenged but not frustrated

---

# Tech Stack

| Component | Tech |
|-----------|------|
| **App** | Expo + React Native |
| **Backend** | Supabase (same as Tradie OS) |
| **Auth** | Anonymous auth with parent acceptance flow |
| **Database** | Postgres via Supabase |
| **Speech** | Expo Audio + Speech API |
| **Offline** | SQLite for local progress |

---

# Data Model (Privacy-First)

```
players
├── id (UUID, auto-generated)
├── display_name (string, filtered)
├── avatar_config (JSON)
├── points_balance (integer)
├── parent_accepted_terms (boolean)
├── created_at (timestamp)

quiz_results
├── id
├── player_id (UUID)
├── subject (math/reading)
├── grade_level (3-6)
├── correct_count
├── total_count
├── completed_at

rewards_owned
├── player_id (UUID)
├── reward_id (string)
├── purchased_at
```

---

# Next Steps

1. **Confirm this direction** — any final changes?
2. **I'll lock the SchoolBuilder concept** — send to Architect
3. **Decide build priority** — Tradie OS or SchoolBuilder first?

---

# Final Questions

- Are daily challenges and story mode something you'd like to include now?
- Should we prepare for a parent dashboard in the future, or focus on the child experience first?

Let me know if this fits your vision or needs tweaks!

---

# REVIEWER

These are excellent additions. Let me break down what you've given me.

---

# Your Answers

| Decision | Your Answer | My Take |
|----------|-------------|---------|
| **Parent gate** | Parent accepts T&C before kid plays | Smart. Legal protection + intentional setup. |
| **Names** | Just first name or username. No surname. | Clean. Reduces accidental identity exposure. |
| **Subjects** | Math and Reading | Locked. |
| **Reading mode** | App reads aloud OR kid reads back with speech recognition highlighting | This is a killer feature. Differentiates you from basic quiz apps. |

---

# Clarification on Friend Codes

I mentioned 24-hour expiry — ignore that. You're right to simplify.

Here's the simpler model:

| Feature | How It Works |
|---------|--------------|
| **Each player** | Gets a permanent 6-digit player code |
| **Adding friends** | Enter friend's code to connect |
| **What friends see** | Avatar + display name + leaderboard scores |
| **No expiry** | Code stays the same forever |
| **No search** | Can't find players by name — code only |

This is safer and simpler. Kids share codes in person or parents share them. No discovery of strangers.

---

# The Read-Along Feature

This is the standout feature. Let me spec it properly.

## Two Reading Modes

| Mode | How It Works |
|------|--------------|
| **Listen Mode** | App reads the story aloud. Words highlight as spoken. Kid follows along. |
| **Read Mode** | Kid reads aloud. Microphone listens. App highlights words as kid speaks them. |

## Technical Implementation

| Component | Tech | Notes |
|-----------|------|-------|
| **Text-to-Speech (Listen Mode)** | Expo Speech API | Built into Expo. Free. Works offline. |
| **Speech-to-Text (Read Mode)** | Expo Speech Recognition or Google Speech API | Expo has basic support. Google is more accurate but costs money. |
| **Word Highlighting** | Custom component | Track current word, highlight in real-time |
| **Accuracy Scoring** | Compare spoken words to text | Flag mispronounced or skipped words |

## Read Mode Flow

```
1. Story appears on screen
2. Kid taps "Start Reading"
3. Microphone activates
4. Kid reads aloud
5. App matches spoken words to text
6. Current word highlights as recognized
7. If kid stumbles, app can:
   - Wait for retry
   - Offer to pronounce the word
   - Skip and mark for review
8. At end, show accuracy score
9. Award points based on accuracy + completion
```

## Risks with Read Mode

| Risk | Impact | Mitigation |
|------|--------|------------|
| **Accents/pronunciation variations** | False negatives — kid says it right but app doesn't recognize | Use fuzzy matching. Allow phonetic variations. |
| **Background noise** | Recognition fails | Guide parents to use in quiet space. Show mic level indicator. |
| **Kid gets frustrated** | Quits if app keeps "failing" them | Be generous with matching. Encourage, don't punish. |
| **Privacy — audio recording** | Could accidentally store voice data | Process on-device only. Never upload audio. Never store recordings. |

## Privacy Commitment for Read Mode

| Rule | Implementation |
|------|----------------|
| **Audio never leaves device** | Process speech locally. No cloud transcription. |
| **No recordings saved** | Stream processed in real-time, then discarded. |
| **No voice profiles** | Don't store voice characteristics. |
| **Parent consent covers this** | T&C explicitly states microphone use for reading feature only. |

---

# Additional Feature Ideas

You asked for great additions. Here's what I'd consider:

## High Value — Add to MVP

| Feature | Why It's Good |
|---------|---------------|
| **Daily streak** | Come back each day, maintain streak, earn bonus points. Builds habit. |
| **Difficulty scaling** | Start easy, get harder as kid improves. Keeps challenge appropriate. |
| **Subject switching** | Tired of math? Switch to reading mid-session. Reduces burnout. |
| **Progress celebrations** | Big animations when hitting milestones (100 questions, new level, etc.) |

## Medium Value — Add in v2

| Feature | Why It's Good |
|---------|---------------|
| **Story mode** | Short stories with comprehension questions at the end |
| **Math word problems** | Bridges math and reading skills |
| **Timed challenges** | Optional speed rounds for kids who want pressure |
| **Achievements gallery** | View all badges earned — collectors love this |

## Lower Priority — Maybe Later

| Feature | Why |
|---------|-----|
| **Parent dashboard** | You said even you shouldn't see other kids' data. Keep it simple for now. |
| **Multiplayer real-time** | Adds complexity. Leaderboards give social without sync headaches. |
| **Custom avatars** | Drawing/uploading images is risky (inappropriate content). Stick to presets. |

---

# Updated MVP Scope

```
SchoolBuilder MVP
├── Parent accepts T&C before kid plays
├── Kid picks avatar + display name (no surname)
├── Kid gets permanent 6-digit friend code
├── Chooses Math or Reading
│
├── MATH MODE
│   ├── Quiz rounds (5-10 questions)
│   ├── Difficulty scales with performance
│   └── Points for correct answers + streaks
│
├── READING MODE
│   ├── Listen Mode — app reads aloud, words highlight
│   ├── Read Mode — kid reads aloud, app highlights as they speak
│   ├── Accuracy scoring (generous matching)
│   └── Points for completion + accuracy
│
├── REWARDS
│   ├── Points balance
│   ├── Avatar shop (hats, colors, backgrounds)
│   ├── Badges for milestones
│   └── Daily streak bonus
│
├── SOCIAL
│   ├── Add friends via 6-digit code
│   ├── Friend leaderboard (avatar + name only)
│   └── Weekly reset
│
└── PRIVACY
    ├── No personal data stored
    ├── Audio processed on-device only
    ├── No recordings saved
    └── Anonymous UUIDs only
```

---

# Tech Stack Confirmed

| Component | Tech |
|-----------|------|
| **App** | Expo + React Native |
| **Backend** | Supabase |
| **Auth** | Supabase anonymous auth |
| **Database** | Postgres via Supabase |
| **Offline storage** | SQLite |
| **Text-to-Speech** | Expo Speech |
| **Speech-to-Text** | expo-speech-recognition (on-device) |

---

# Questions Before Architecture

| Question | Options |
|----------|---------|
| **Story content** | Do you want to write stories yourself? Use public domain? Or have AI generate them? |
| **Math question source** | Should I generate a question bank? Or pull from a curriculum API? |
| **Age/grade selection** | Should kid pick their grade at setup? Or should difficulty just adapt automatically? |

---

# Next Steps

| Step | Action |
|------|--------|
| **1** | You answer the three questions above |
| **2** | I lock SchoolBuilder concept completely |
| **3** | Architect builds the full technical spec |
| **4** | You decide build order — Tradie OS first or SchoolBuilder first |

What's your call on the story content, math questions, and grade selection?
# TETSUO

# Akira — Status Report

---

## What I Understood

Locking the content system spec with your decisions:

| Decision | Your Answer |
|----------|-------------|
| Story Rotation | Archive old stories (accessible) |
| Chapter Unlocking | Answer questions correctly to unlock |
| Question Pool | 100% story-themed |
| Offline Support | Yes — local caching |
| Worker Hosting | Railway cron job |
| Voice | OpenAI TTS for read-aloud |
| Content Review | Manual approval before publish |

---

## SPEC LOCKED

---

## Final Architecture Spec

### System Components

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CONTENT GENERATION PIPELINE                       │
└─────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
  │  RAILWAY     │ ──▶  │   WORKER     │ ──▶  │   SUPABASE   │
  │  CRON JOB    │      │  (Node.js)   │      │   Database   │
  │  Wed & Sat   │      │              │      │              │
  │  3:00 AM     │      │              │      │              │
  └──────────────┘      └──────┬───────┘      └──────────────┘
                               │                     │
                    ┌──────────┴──────────┐          │
                    ▼                     ▼          │
            ┌──────────────┐      ┌──────────────┐   │
            │  Claude API  │      │  OpenAI TTS  │   │
            │  (stories +  │      │  (voice      │   │
            │  questions)  │      │   audio)     │   │
            └──────────────┘      └──────────────┘   │
                                                     │
                                                     ▼
                                            ┌──────────────┐
                                            │   PENDING    │
                                            │   REVIEW     │
                                            │   QUEUE      │
                                            └──────┬───────┘
                                                   │
                                          Marshall approves
                                                   │
                                                   ▼
  ┌──────────────┐      ┌──────────────┐   ┌──────────────┐
  │  React App   │ ◀──  │   Supabase   │ ◀─│   PUBLISHED  │
  │  (online)    │      │   (reads)    │   │   CONTENT    │
  └──────────────┘      └──────────────┘   └──────────────┘
         │
         ▼
  ┌──────────────┐
  │  IndexedDB   │
  │  (offline    │
  │   cache)     │
  └──────────────┘
```

---

### Database Schema

```sql
-- ========================================
-- STORIES
-- ========================================
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  setting TEXT NOT NULL,
  characters JSONB NOT NULL,
  total_chapters INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'archived')),
  publish_date DATE,
  created_at TIMESTAMP DEFAULT now(),
  approved_at TIMESTAMP,
  approved_by TEXT
);

-- ========================================
-- CHAPTERS
-- ========================================
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  audio_url TEXT,                    -- OpenAI TTS audio file URL
  questions_required INTEGER DEFAULT 3,  -- Questions to answer to unlock next
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(story_id, chapter_number)
);

-- ========================================
-- MATH QUESTIONS
-- ========================================
CREATE TABLE math_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  building TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  story_context TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  answer TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- ========================================
-- CONTENT SCHEDULE
-- ========================================
CREATE TABLE content_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'review', 'complete', 'failed')),
  story_id UUID REFERENCES stories(id),
  generation_log JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT now(),
  completed_at TIMESTAMP
);

-- ========================================
-- USER STORY PROGRESS
-- ========================================
CREATE TABLE user_story_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  story_id UUID REFERENCES stories(id),
  current_chapter INTEGER DEFAULT 1,
  chapters_unlocked INTEGER[] DEFAULT '{1}',
  questions_correct_this_chapter INTEGER DEFAULT 0,
  total_questions_answered INTEGER DEFAULT 0,
  last_read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, story_id)
);

-- ========================================
-- AUDIO FILES (TTS)
-- ========================================
CREATE TABLE audio_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_size_bytes INTEGER,
  duration_seconds INTEGER,
  voice TEXT DEFAULT 'alloy',
  created_at TIMESTAMP DEFAULT now()
);

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_stories_publish ON stories(publish_date);
CREATE INDEX idx_chapters_story ON chapters(story_id);
CREATE INDEX idx_questions_story ON math_questions(story_id);
CREATE INDEX idx_questions_chapter ON math_questions(chapter_number);
CREATE INDEX idx_questions_building ON math_questions(building);
CREATE INDEX idx_progress_user ON user_story_progress(user_id);
CREATE INDEX idx_schedule_status ON content_schedule(status);
```

---

### Folder Structure

```
school-builder/
├── src/
│   ├── components/
│   │   ├── Story/
│   │   │   ├── StoryReader.jsx
│   │   │   ├── ChapterList.jsx
│   │   │   ├── ChapterContent.jsx
│   │   │   ├── AudioPlayer.jsx        # TTS playback
│   │   │   └── ChapterUnlock.jsx      # Shows unlock progress
│   │   └── Quiz/
│   │       └── ThemedQuestion.jsx
│   │
│   ├── hooks/
│   │   ├── useCurrentStory.js
│   │   ├── useChapters.js
│   │   ├── useThemedQuestions.js
│   │   ├── useStoryProgress.js
│   │   ├── useChapterUnlock.js
│   │   └── useOfflineCache.js         # IndexedDB sync
│   │
│   ├── lib/
│   │   ├── supabase.js
│   │   └── offlineStorage.js          # IndexedDB wrapper
│   │
│   └── pages/
│       ├── StoryArchive.jsx           # Browse old stories
│       └── CurrentStory.jsx
│
├── worker/
│   ├── package.json
│   ├── index.js
│   ├── scheduler.js
│   ├── generators/
│   │   ├── storyGenerator.js          # Claude API
│   │   ├── questionGenerator.js       # Claude API
│   │   └── audioGenerator.js          # OpenAI TTS
│   ├── prompts/
│   │   ├── storyPrompt.txt
│   │   └── questionPrompt.txt
│   └── db/
│       └── supabaseAdmin.js
│
├── admin/
│   └── ContentReview.jsx              # Your approval interface
│
├── supabase/
│   └── migrations/
│       └── 001_content_system.sql
│
└── .env
    ├── ANTHROPIC_API_KEY
    ├── OPENAI_API_KEY
    ├── SUPABASE_URL
    ├── SUPABASE_ANON_KEY
    └── SUPABASE_SERVICE_KEY
```

---

### Chapter Unlock Logic

```
Player reads Chapter 1
        │
        ▼
Player answers questions (building = any, chapter = 1)
        │
        ▼
questions_correct_this_chapter increments
        │
        ▼
When questions_correct_this_chapter >= chapter.questions_required (default 3)
        │
        ▼
Chapter 2 added to chapters_unlocked array
questions_correct_this_chapter resets to 0
        │
        ▼
Player can now read Chapter 2
```

---

### Offline Caching Strategy

```
ON APP LOAD:
  1. Check Supabase for current story
  2. Compare with IndexedDB cached version
  3. If newer → download story + chapters + questions + audio
  4. Store in IndexedDB

ON OFFLINE:
  1. Detect navigator.onLine === false
  2. Read from IndexedDB
  3. Queue progress updates for sync

ON BACK ONLINE:
  1. Sync queued progress to Supabase
  2. Check for content updates
```

---

### Content Review Flow

```
CRON runs (Wed/Sat 3 AM)
        │
        ▼
Worker generates story + questions + audio
        │
        ▼
Saves to Supabase with status = 'pending'
        │
        ▼
Notification sent to Marshall (email/SMS/webhook)
        │
        ▼
Marshall opens admin/ContentReview.jsx
        │
        ├── Read story
        ├── Check questions
        ├── Listen to audio samples
        │
        ▼
Marshall clicks "Approve" or "Reject + Notes"
        │
        ▼
If approved:
  - status = 'approved'
  - publish_date = next scheduled date
  - Previous story status = 'archived'
```

---

### Cost Estimate (Updated)

| Item | Cost |
|------|------|
| Claude API (1 story, 5-7 chapters) | ~$0.20 |
| Claude API (40 questions) | ~$0.10 |
| OpenAI TTS (~30 min audio) | ~$0.90 |
| **Per generation cycle** | **~$1.20** |
| **Per week (2 cycles)** | **~$2.40** |
| **Monthly** | **~$10.00** |

Supabase free tier covers database + storage.

---

## Mode

**BUILD MODE**

---

## Build Phases

| Phase | Description | Deliverables |
|-------|-------------|--------------|
| 1 | Database setup | Supabase migration, tables, indexes |
| 2 | Content worker | Railway project, Claude + OpenAI integration |
| 3 | Admin review UI | Simple approval interface |
| 4 | React hooks | Data fetching + offline cache |
| 5 | Story components | Reader, audio player, unlock UI |
| 6 | Offline support | IndexedDB sync layer |

---

## Ready for Phase 1?

Say **EXECUTE PHASE 1** and I'll create the Supabase migration file and setup instructions.

Or tell me if you want to adjust anything before we start building.

---

# BACKEND

# Akira — Status Report

---

## What I Understood

You provided answers to the architecture questions for the school-builder's new content system. Ready to lock the spec and move to build mode.

---

## Your Decisions

1. **Story Rotation:** Keep old stories in an archive
2. **Chapter Unlocking:** Unlock chapters by answering questions correctly
3. **Question Pool:** 100% story-themed questions
4. **Offline Support:** Yes, with local caching
5. **Worker Hosting:** Railway for the cron job
6. **Content Review:** You approve content before it publishes
7. **Additional:** Use OpenAI TTS for realistic read-aloud voice

---

## Mode

**BUILD MODE**

---

## Execution Plan

### Phase 1: Supabase Setup + Initial Content Generation

1. **Create Supabase Tables**

   - **Location:** `supabase/migrations/001_content_system.sql`
   - **Action:** Define and execute the schema

2. **Build Content Generator Worker**

   - **Location:** `worker/index.js`, `worker/generators/`
   - **Action:** Implement content generation logic using Claude API
   - **Include:** Logic for story generation and math question generation

3. **Set Up Cron Job on Railway**

   - **Location:** `worker/scheduler.js`
   - **Action:** Schedule content generation to run on Wed & Sat at 3 AM
   - **Include:** Retry logic and failure notifications

4. **Implement Content Review Workflow**

   - **Location:** `worker/generators/index.js`
   - **Action:** Generate content to a "pending" status
   - **Include:** Manual approval step before publishing

5. **Integrate OpenAI TTS for Read-Aloud**

   - **Location:** `worker/generators/storyGenerator.js`
   - **Action:** Generate audio files for story chapters
   - **Include:** Code to call OpenAI TTS API

6. **React App Integration**

   - **Location:** `src/hooks/`, `src/components/`
   - **Action:** Implement hooks and components for fetching and displaying content
   - **Include:** Offline caching logic

---

## Environment Variables Needed

```
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-opa-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...  # Service role key for server-side writes
```

---

## Next Step

1. Create Supabase migration file and execute it
2. Implement the content generator worker
3. Set up Railway cron job
4. Integrate content review and TTS
5. Update React app with new hooks and components

---

**Marshall, say "EXECUTE"** to start Phase 1 of the build process.

---

# FRONTEND

# Akira — Status Report

---

## What I Understood

Marshall provided answers to the open questions for the school-builder content system. Move to BUILD mode.

---

## Mode

**BUILD MODE**

---

## Instructions from Marshall

1. **Story Rotation:** Keep old stories in an archive
2. **Chapter Unlocking:** Unlock chapters by answering questions correctly
3. **Question Pool:** 100% story-themed questions
4. **Offline Support:** Yes, with local caching
5. **Worker Hosting:** Railway for the cron job
6. **Content Review:** Marshall approves content before it publishes
7. **New Requirement:** Use OpenAI TTS for realistic read-aloud voice

---

## Next Steps

**Move to BUILD MODE** and execute the full plan with these requirements.

---

## Execution Plan

### Step 1: Database Migration

**File:** `supabase/migrations/001_content_system.sql`

- Create tables: `stories`, `chapters`, `math_questions`, `content_schedule`, `user_story_progress`
- Add indexes and constraints
- Add triggers/rules for content approval workflow

**How to run:**

```bash
supabase db push --file supabase/migrations/001_content_system.sql
```

### Step 2: Worker Service

**Folder:** `worker/`

- **File:** `index.js` — Main entry point
- **File:** `scheduler.js` — Cron setup
- **File:** `generators/storyGenerator.js` — Claude story prompts
- **File:** `generators/questionGenerator.js` — Claude question prompts
- **File:** `generators/ttsGenerator.js` — OpenAI TTS integration
- **File:** `db/supabaseAdmin.js` — Supabase admin client
- **File:** `prompts/*.txt` — Prompt templates for story and questions

**How to run:**

```bash
node worker/index.js
```

### Step 3: React App Integration

**Folder:** `src/`

- **File:** `hooks/useCurrentStory.js` — Fetch active story
- **File:** `hooks/useChapters.js` — Fetch chapters
- **File:** `hooks/useThemedQuestions.js` — Fetch questions by building
- **File:** `hooks/useStoryProgress.js` — Track user progress

**Components:**

- **StoryReader.jsx** — Main story display with read-aloud
- **ChapterList.jsx** — Chapter navigation
- **ChapterContent.jsx** — Single chapter view
- **ThemedQuestion.jsx** — Story-themed questions

**How to preview:**

Run the React app and navigate to the story section to see new content flow.

### Step 4: Local Caching

Implement service workers or IndexedDB to cache stories and questions for offline access.

### Step 5: Content Approval Workflow

Integrate a simple admin dashboard for Marshall to approve content before it goes live.

---

## Backend Dependencies

- **Supabase:** Database operations
- **Claude API (Anthropic):** Story and question generation
- **OpenAI API:** Text-to-speech for read-aloud

---

## Verification

- Ensure database schema matches the design
- Test story and question generation manually
- Verify content approval workflow
- Confirm offline caching works as expected

---

## Final Notes

Once the above steps are executed, we'll have a fully functional content system with AI-generated stories and questions, local caching, and a realistic read-aloud feature.

**Marshall, let me know when you're ready to start the build.**
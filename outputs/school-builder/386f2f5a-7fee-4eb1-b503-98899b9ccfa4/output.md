# TETSUO

# Akira — Status Report

---

## What I Understood

Cancel current execution. Redesign the content system for School Builder with:
- AI-generated content (math questions + stories)
- Auto-generation every Wednesday and Saturday
- Stories: long, chapter-based
- Math questions: themed to match the current story
- Storage: Supabase
- App reads content from Supabase (not static files)

---

## Mode

**ARCHITECTURE MODE**

---

## Current State (Being Replaced)

```
src/data/mathQuestions.js  ←  Static file, manually created
src/data/shopItems.js      ←  Building definitions (stays)
```

Problems with current approach:
- Content is static — same questions forever
- Manual effort to create and update
- No story integration
- No freshness or variety

---

## New Content System Architecture

### Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     CONTENT GENERATION                          │
│                   (Runs Wed & Sat @ 3 AM)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │   CRON JOB  │───▶│  GENERATE   │───▶│   STORE IN  │        │
│   │  (Railway)  │    │   CONTENT   │    │   SUPABASE  │        │
│   └─────────────┘    └─────────────┘    └─────────────┘        │
│                            │                                    │
│                            ▼                                    │
│                    ┌───────────────┐                           │
│                    │  Claude API   │                           │
│                    │  (Anthropic)  │                           │
│                    └───────────────┘                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        SUPABASE                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────────┐    ┌─────────────────┐                   │
│   │     stories     │    │  math_questions │                   │
│   ├─────────────────┤    ├─────────────────┤                   │
│   │ id              │    │ id              │                   │
│   │ title           │    │ story_id (FK)   │                   │
│   │ theme           │    │ building        │                   │
│   │ chapters (JSON) │    │ difficulty      │                   │
│   │ created_at      │    │ question        │                   │
│   │ active_from     │    │ options (JSON)  │                   │
│   │ active_until    │    │ answer          │                   │
│   └─────────────────┘    │ story_context   │                   │
│                          │ created_at      │                   │
│                          └─────────────────┘                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                     REACT APP                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │  useStory   │    │useQuestions │    │  Supabase   │        │
│   │    Hook     │───▶│    Hook     │───▶│   Client    │        │
│   └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema

### Table: `stories`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Story title |
| theme | text | Theme (e.g., "space_adventure", "underwater_mystery") |
| chapters | jsonb | Array of chapter objects |
| total_chapters | int | Number of chapters |
| created_at | timestamp | When generated |
| active_from | timestamp | When this story becomes active |
| active_until | timestamp | When this story expires |
| is_active | boolean | Currently active story |

**Chapter structure (inside `chapters` JSON):**
```json
{
  "chapter_number": 1,
  "title": "The Launch",
  "content": "Long chapter text here...",
  "buildings_unlocked": ["rockets", "stars"],
  "math_concepts": ["multiplication", "division"]
}
```

### Table: `math_questions`

| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| story_id | uuid | FK to stories |
| building | text | Building key (matches shopItems) |
| chapter_number | int | Which chapter this question relates to |
| difficulty | text | easy, medium, hard |
| story_context | text | Mini story tying question to main story |
| question | text | The math question |
| options | jsonb | Array of 4 options |
| answer | text | Correct answer |
| created_at | timestamp | When generated |

---

## Content Generation Service

### Location
```
~/projects/school-builder/
├── src/                    # React app (unchanged)
├── services/
│   └── content-generator/
│       ├── index.js        # Main entry point
│       ├── generateStory.js
│       ├── generateQuestions.js
│       ├── supabaseClient.js
│       └── prompts/
│           ├── storyPrompt.js
│           └── questionPrompt.js
└── package.json
```

### Generation Flow

```
1. CRON triggers (Wed/Sat 3 AM)
         │
         ▼
2. Generate Story
   - Call Claude API
   - Theme: random or seasonal
   - Output: 5-7 chapters
   - Each chapter: 800-1200 words
         │
         ▼
3. Generate Math Questions
   - For each building (8 buildings)
   - 5 questions per building = 40 questions
   - Themed to match story
   - Reference chapter events in story_context
         │
         ▼
4. Store in Supabase
   - Insert story (active_from = now)
   - Insert all questions (linked to story)
   - Mark previous story as inactive
         │
         ▼
5. Done — App automatically shows new content
```

---

## App Integration

### New Hooks

**useCurrentStory.js**
```javascript
// Fetches the currently active story
// Returns: { story, chapters, loading, error }
// Auto-refreshes when active story changes
```

**useStoryQuestions.js**
```javascript
// Fetches questions for current story + specific building
// Parameters: (buildingKey)
// Returns: { questions, loading, error }
// Filters by story_id and building
```

### Component Changes

| Component | Change |
|-----------|--------|
| GamePlay.jsx | Use `useStoryQuestions(building)` instead of static import |
| StoryReader.jsx | NEW — displays chapters, tracks progress |
| BuildingModal.jsx | Show story_context before each question |
| ProgressTracker.jsx | Track chapter completion alongside building completion |

---

## Story Structure Example

**Theme:** "The Clockwork Kingdom"

| Chapter | Title | Buildings Unlocked | Math Focus |
|---------|-------|-------------------|------------|
| 1 | The Broken Clock Tower | gravity, gears | multiplication |
| 2 | The Inventor's Workshop | electricity, magnets | division |
| 3 | The Underground River | water, boats | fractions |
| 4 | The Crystal Caves | crystals, light | geometry |
| 5 | The Final Gear | all buildings | mixed review |

Each chapter: 800-1200 words with cliffhanger endings.

Math questions reference story events:
> "The clockmaker needs 5 gears for each of the 12 towers. How many gears total?"

---

## Scheduling (CRON)

**Option A: Railway Cron Job**
- Add cron service to existing Railway project
- Runs `node services/content-generator/index.js`
- Schedule: `0 3 * * 3,6` (3 AM on Wed, Sat)

**Option B: Supabase Edge Function + pg_cron**
- Use Supabase's built-in scheduling
- Edge function calls Claude API
- No separate service needed

**My recommendation:** Option A (Railway) — more control, easier debugging, keeps AI logic in your codebase.

---

## Environment Variables Needed

```
ANTHROPIC_API_KEY=sk-ant-...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...  # Service role key for server-side writes
```

---

## Migration Path

| Phase | Tasks |
|-------|-------|
| 1 | Set up Supabase tables |
| 2 | Build content generator service |
| 3 | Generate first story + questions manually |
| 4 | Update React app to read from Supabase |
| 5 | Set up CRON for auto-generation |
| 6 | Remove static mathQuestions.js files |

---

## Open Questions for You

1. **Story length preference?**
   - 5 chapters (shorter, faster turnover)
   - 7 chapters (longer, more depth)
   - 10 chapters (week-long saga)

2. **Question refresh behavior?**
   - All new questions each cycle
   - Keep some "evergreen" questions
   - Progressive difficulty through the week

3. **Story themes — random or curated?**
   - Random from a theme list
   - Seasonal (space in winter, ocean in summer)
   - You pick each week

4. **Chapter unlocking?**
   - All chapters available immediately
   - Unlock next chapter after completing building questions
   - Time-gated (new chapter each day)

---

## Cost Estimate

| Item | Cost |
|------|------|
| Claude API (story generation) | ~$0.15 per story |
| Claude API (40 questions) | ~$0.10 per batch |
| Per cycle (Wed + Sat) | ~$0.50/week |
| Monthly | ~$2.00 |

Supabase free tier covers this easily.

---

## Next Step

Answer the open questions above, then say **BUILD** and I'll create the execution plan for Phase 1 (Supabase tables + content generator service).

---

# ARCHITECT

# Akira — Status Report

---

## What I Understood

Cancel current execution. Redesign the content system for school-builder with:
- AI-generated content (math questions + stories)
- Automatic generation every Wednesday and Saturday
- Stories: long, chapter-based
- Math questions: themed to match the current story
- Storage: Supabase
- App reads content from Supabase (not static files)

---

## Mode

**ARCHITECTURE MODE**

---

## Workers Involved

- **Architect** — System design for new content pipeline

---

## Current State

Static JSON files with hardcoded math questions. No stories. No automation.

---

## New System Design

---

### System Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CONTENT GENERATION PIPELINE                       │
└─────────────────────────────────────────────────────────────────────┘

  ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
  │   CRON JOB   │ ──▶  │   WORKER     │ ──▶  │   SUPABASE   │
  │  Wed & Sat   │      │  (Node.js)   │      │   Database   │
  │   12:00 AM   │      │              │      │              │
  └──────────────┘      └──────────────┘      └──────────────┘
                              │
                              ▼
                        ┌──────────────┐
                        │   Claude AI  │
                        │   (Anthropic │
                        │     API)     │
                        └──────────────┘

  ┌──────────────┐      ┌──────────────┐
  │  React App   │ ◀──  │   Supabase   │
  │ (school-     │      │   (reads)    │
  │  builder)    │      │              │
  └──────────────┘      └──────────────┘
```

---

### Data Flow

```
1. CRON TRIGGER (Wed/Sat 12:00 AM)
         │
         ▼
2. CONTENT WORKER STARTS
         │
         ├──▶ Generate Story (Claude API)
         │         │
         │         ▼
         │    Story with 5-7 chapters
         │    Theme, setting, characters
         │         │
         │         ▼
         ├──▶ Generate Math Questions (Claude API)
         │         │
         │         ▼
         │    40 questions themed to story
         │    Mapped to buildings
         │    Difficulty: easy/medium/hard
         │
         ▼
3. STORE IN SUPABASE
         │
         ├──▶ stories table
         ├──▶ chapters table
         ├──▶ math_questions table
         └──▶ content_schedule table
         
         ▼
4. APP READS FROM SUPABASE
         │
         ├──▶ Current story + chapters
         ├──▶ Math questions for each building
         └──▶ Progress tracking per user
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
  is_active BOOLEAN DEFAULT false,
  publish_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT now()
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
  unlock_requirement TEXT,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(story_id, chapter_number)
);

-- ========================================
-- MATH QUESTIONS
-- ========================================
CREATE TABLE math_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  building TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  story_context TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  answer TEXT NOT NULL,
  chapter_reference INTEGER,
  created_at TIMESTAMP DEFAULT now()
);

-- ========================================
-- CONTENT SCHEDULE
-- ========================================
CREATE TABLE content_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id),
  scheduled_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'complete', 'failed')),
  generation_log TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- ========================================
-- USER PROGRESS (extends existing)
-- ========================================
CREATE TABLE user_story_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  story_id UUID REFERENCES stories(id),
  current_chapter INTEGER DEFAULT 1,
  chapters_completed INTEGER[] DEFAULT '{}',
  questions_answered INTEGER DEFAULT 0,
  last_read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  UNIQUE(user_id, story_id)
);

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX idx_stories_active ON stories(is_active);
CREATE INDEX idx_stories_publish ON stories(publish_date);
CREATE INDEX idx_chapters_story ON chapters(story_id);
CREATE INDEX idx_questions_story ON math_questions(story_id);
CREATE INDEX idx_questions_building ON math_questions(building);
CREATE INDEX idx_progress_user ON user_story_progress(user_id);
```

---

### Folder Structure

```
school-builder/
├── src/
│   ├── components/
│   │   ├── Story/
│   │   │   ├── StoryReader.jsx       # Main story display
│   │   │   ├── ChapterList.jsx       # Chapter navigation
│   │   │   ├── ChapterContent.jsx    # Single chapter view
│   │   │   └── StoryProgress.jsx     # Progress indicator
│   │   └── Quiz/
│   │       └── ThemedQuestion.jsx    # Story-themed questions
│   ├── hooks/
│   │   ├── useCurrentStory.js        # Fetch active story
│   │   ├── useChapters.js            # Fetch chapters
│   │   ├── useThemedQuestions.js     # Fetch questions by building
│   │   └── useStoryProgress.js       # Track user progress
│   ├── lib/
│   │   └── supabase.js               # Supabase client
│   └── data/
│       └── (removed - no more static files)
│
├── worker/
│   ├── index.js                      # Main worker entry
│   ├── scheduler.js                  # Cron job setup
│   ├── generators/
│   │   ├── storyGenerator.js         # Claude story prompts
│   │   └── questionGenerator.js      # Claude question prompts
│   ├── prompts/
│   │   ├── storyPrompt.txt           # Story generation template
│   │   └── questionPrompt.txt        # Question generation template
│   └── db/
│       └── supabaseAdmin.js          # Supabase admin client
│
├── supabase/
│   └── migrations/
│       └── 001_content_system.sql    # Schema migration
│
└── .env
    ├── ANTHROPIC_API_KEY
    ├── SUPABASE_URL
    ├── SUPABASE_ANON_KEY
    └── SUPABASE_SERVICE_KEY
```

---

### Content Generation Prompts

**Story Generation Prompt (Template):**

```
Generate a children's educational story for ages 8-12.

REQUIREMENTS:
- Title: Creative, engaging
- Theme: [ROTATING: space, ocean, jungle, ancient history, future city]
- Chapters: 5-7 chapters
- Each chapter: 800-1200 words
- Include: Scientific facts woven into narrative
- Characters: 2-3 main characters kids can relate to
- Tone: Adventurous but educational

BUILDING THEMES TO INCORPORATE:
- Stars/astronomy
- Lightning/electricity  
- Bones/biology
- Rainbows/light
- Melting/temperature
- Tornadoes/weather
- Sound/waves
- Rockets/physics

OUTPUT FORMAT:
{
  "title": "...",
  "theme": "...",
  "setting": "...",
  "characters": [...],
  "chapters": [
    {
      "number": 1,
      "title": "...",
      "content": "...",
      "summary": "...",
      "scienceTopics": ["stars", "rockets"]
    }
  ]
}
```

**Question Generation Prompt (Template):**

```
Generate math questions themed to this story for a children's educational game.

STORY CONTEXT:
[INSERT STORY SUMMARY AND CHARACTERS]

REQUIREMENTS:
- 5 questions per building (8 buildings = 40 total)
- Each question references story characters/events
- Difficulty distribution: 2 easy, 2 medium, 1 hard per building
- Age appropriate: grades 3-5 math

BUILDINGS:
- stars, lightning, bones, rainbows, melting, tornadoes, sound, rockets

OUTPUT FORMAT:
{
  "questions": [
    {
      "building": "stars",
      "difficulty": "easy",
      "storyContext": "When Maya looked through the telescope...",
      "question": "If Maya counted 12 stars...",
      "options": ["...", "...", "...", "..."],
      "answer": "..."
    }
  ]
}
```

---

### Worker Implementation

**scheduler.js:**

```javascript
import cron from 'node-cron';
import { generateContent } from './generators/index.js';

// Run every Wednesday and Saturday at midnight
cron.schedule('0 0 * * 3,6', async () => {
  console.log('Starting content generation...');
  
  try {
    await generateContent();
    console.log('Content generation complete');
  } catch (error) {
    console.error('Content generation failed:', error);
    // Alert/notify on failure
  }
});
```

**generators/index.js:**

```javascript
import { generateStory } from './storyGenerator.js';
import { generateQuestions } from './questionGenerator.js';
import { supabaseAdmin } from '../db/supabaseAdmin.js';

export async function generateContent() {
  // 1. Generate story
  const story = await generateStory();
  
  // 2. Insert story and chapters
  const { data: storyRecord } = await supabaseAdmin
    .from('stories')
    .insert({
      title: story.title,
      theme: story.theme,
      setting: story.setting,
      characters: story.characters,
      total_chapters: story.chapters.length,
      publish_date: getNextPublishDate()
    })
    .select()
    .single();
  
  // 3. Insert chapters
  const chapters = story.chapters.map(ch => ({
    story_id: storyRecord.id,
    chapter_number: ch.number,
    title: ch.title,
    content: ch.content,
    summary: ch.summary
  }));
  
  await supabaseAdmin.from('chapters').insert(chapters);
  
  // 4. Generate themed questions
  const questions = await generateQuestions(story);
  
  // 5. Insert questions
  const questionRecords = questions.map(q => ({
    story_id: storyRecord.id,
    building: q.building,
    difficulty: q.difficulty,
    story_context: q.storyContext,
    question: q.question,
    options: q.options,
    answer: q.answer
  }));
  
  await supabaseAdmin.from('math_questions').insert(questionRecords);
  
  // 6. Mark as ready
  await supabaseAdmin
    .from('stories')
    .update({ is_active: true })
    .eq('id', storyRecord.id);
  
  return storyRecord;
}
```

---

### App Integration

**hooks/useCurrentStory.js:**

```javascript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useCurrentStory() {
  return useQuery({
    queryKey: ['currentStory'],
    queryFn: async () => {
      const { data } = await supabase
        .from('stories')
        .select(`
          *,
          chapters (*)
        `)
        .eq('is_active', true)
        .order('publish_date', { ascending: false })
        .limit(1)
        .single();
      
      return data;
    }
  });
}
```

**hooks/useThemedQuestions.js:**

```javascript
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';

export function useThemedQuestions(building, storyId) {
  return useQuery({
    queryKey: ['questions', building, storyId],
    queryFn: async () => {
      const { data } = await supabase
        .from('math_questions')
        .select('*')
        .eq('story_id', storyId)
        .eq('building', building);
      
      return data;
    },
    enabled: !!storyId
  });
}
```

---

### Open Questions for Marshall

1. **Story Rotation:** Should old stories remain accessible, or only show the current one?

2. **Chapter Unlocking:** How do players unlock new chapters?
   - Option A: Answer X questions correctly
   - Option B: Build specific buildings
   - Option C: Time-based (one chapter per day)

3. **Question Pool:** Should the app show ONLY story-themed questions, or mix with a base pool?

4. **Offline Support:** Do we need to cache content for offline play?

5. **Worker Hosting:** Where should the cron worker run?
   - Option A: Vercel Cron (if using Vercel)
   - Option B: Railway/Render worker
   - Option C: Supabase Edge Functions
   - Option D: GitHub Actions scheduled workflow

6. **Content Review:** Should generated content go through manual review before going live, or auto-publish?

---

## What's Next

Once you answer the open questions, I'll produce:
1. Complete Supabase migration file
2. Worker implementation
3. React hooks and components
4. Content generation prompts

**Your call, Marshall.**
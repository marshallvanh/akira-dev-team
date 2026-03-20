# BACKEND

# Execution Plan

---

## Task

Create a Supabase migration file for the `school-builder` project with the complete schema design:

- **Tables**: stories, chapters, math_questions, content_schedule, user_story_progress, audio_files
- **Indexes**: Optimized for queries
- **Comments**: Document table purpose and key columns

---

## File Path

**Location**: `~/projects/school-builder/supabase/migrations/001_content_system.sql`

---

## Migration File Content

```sql
-- ========================================
-- SCHOOL-BUILDER CONTENT SYSTEM
-- Migration 001: Core Tables
-- ========================================

-- ========================================
-- STORIES
-- ========================================
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  setting TEXT NOT NULL,
  characters JSONB NOT NULL DEFAULT '[]',
  total_chapters INTEGER NOT NULL DEFAULT 5,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'archived')),
  publish_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ,
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
  audio_url TEXT,
  questions_required INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(story_id, chapter_number)
);

-- ========================================
-- MATH QUESTIONS (Story-Themed)
-- ========================================
CREATE TABLE math_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  chapter_number INTEGER NOT NULL,
  building TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  story_context TEXT NOT NULL,
  question TEXT NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  answer TEXT NOT NULL,
  explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================
-- CONTENT SCHEDULE
-- ========================================
CREATE TABLE content_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scheduled_date DATE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'generating', 'review', 'complete', 'failed')),
  story_id UUID REFERENCES stories(id),
  generation_log JSONB DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ
);

-- ========================================
-- USER STORY PROGRESS
-- ========================================
CREATE TABLE user_story_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  current_chapter INTEGER DEFAULT 1,
  chapters_unlocked INTEGER[] DEFAULT '{1}',
  questions_correct_this_chapter INTEGER DEFAULT 0,
  total_questions_answered INTEGER DEFAULT 0,
  total_questions_correct INTEGER DEFAULT 0,
  last_read_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
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
  voice TEXT DEFAULT 'fable',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX idx_stories_status ON stories(status);
CREATE INDEX idx_stories_publish_date ON stories(publish_date);
CREATE INDEX idx_chapters_story_id ON chapters(story_id);
CREATE INDEX idx_chapters_story_chapter ON chapters(story_id, chapter_number);
CREATE INDEX idx_questions_story_id ON math_questions(story_id);
CREATE INDEX idx_questions_chapter ON math_questions(story_id, chapter_number);
CREATE INDEX idx_questions_building ON math_questions(building);
CREATE INDEX idx_questions_difficulty ON math_questions(difficulty);
CREATE INDEX idx_progress_user_id ON user_story_progress(user_id);
CREATE INDEX idx_progress_story_id ON user_story_progress(story_id);
CREATE INDEX idx_schedule_status ON content_schedule(status);
CREATE INDEX idx_schedule_date ON content_schedule(scheduled_date);
CREATE INDEX idx_audio_chapter_id ON audio_files(chapter_id);

-- ========================================
-- COMMENTS
-- ========================================
COMMENT ON TABLE stories IS 'AI-generated stories with approval workflow';
COMMENT ON TABLE chapters IS 'Story chapters with TTS audio support';
COMMENT ON TABLE math_questions IS '100% story-themed math questions';
COMMENT ON TABLE content_schedule IS 'Tracks scheduled content generation';
COMMENT ON TABLE user_story_progress IS 'Player progress through stories';
COMMENT ON TABLE audio_files IS 'OpenAI TTS audio files (voice: fable)';
COMMENT ON COLUMN chapters.questions_required IS 'Questions to answer correctly to unlock next chapter';
COMMENT ON COLUMN math_questions.story_context IS 'How this question ties into the story narrative';

```

---

## How to Apply the Migration

1. **Navigate to the project directory**:
   ```bash
   cd ~/projects/school-builder
   ```

2. **Run the Supabase CLI migration**:
   ```bash
   supabase db push
   ```

   Make sure you have the Supabase CLI installed and configured with your project.

---

## What to Verify

- Ensure all tables are created with the correct schema.
- Verify indexes are in place for optimized performance.
- Check that comments are correctly applied to tables and columns.
- Confirm that no errors occurred during the migration.

---

**Supabase migration file is ready. Let me know if further assistance is needed!**
# BACKEND

# Execution Plan

---

## Task

Create the worker folder structure and all related files for the `school-builder` project. The worker will generate stories and math questions using Claude, save them to Supabase, and set their status to pending for approval.

---

## Directory Structure

**Location:** `~/projects/school-builder/worker/`

```
worker/
|-- index.js
|-- scheduler.js
|-- notify.js
|-- generators/
|   |-- storyGenerator.js
|   |-- questionGenerator.js
|   |-- audioGenerator.js
|-- supabase/
|   |-- client.js
```

---

## Execution Plan

**Commands:**

```bash
mkdir -p ~/projects/school-builder/worker/generators
mkdir -p ~/projects/school-builder/worker/supabase
```

**Files:**

### 1. `index.js`

**Path:** `~/projects/school-builder/worker/index.js`

```javascript
const scheduler = require('./scheduler');

console.log('========================================');
console.log('School Builder Content Worker');
console.log('========================================');
console.log('Schedule: Wednesdays and Saturdays at 6:00 AM');
console.log('Started at:', new Date().toISOString());
console.log('========================================');

scheduler.start();
```

### 2. `scheduler.js`

**Path:** `~/projects/school-builder/worker/scheduler.js`

```javascript
const cron = require('node-cron');
const storyGenerator = require('./generators/storyGenerator');
const questionGenerator = require('./generators/questionGenerator');
const audioGenerator = require('./generators/audioGenerator');
const supabase = require('./supabase/client');
const notify = require('./notify');

async function generateContent() {
  console.log('\n[SCHEDULER] Starting content generation...');
  
  const { data: schedule, error: scheduleError } = await supabase
    .from('content_schedule')
    .insert({
      scheduled_date: new Date().toISOString().split('T')[0],
      status: 'generating'
    })
    .select()
    .single();

  if (scheduleError) {
    console.error('[SCHEDULER] Failed to create schedule record:', scheduleError);
    return;
  }

  const scheduleId = schedule.id;
  console.log('[SCHEDULER] Schedule ID:', scheduleId);

  try {
    console.log('[SCHEDULER] Step 1: Generating story...');
    const story = await storyGenerator.generate();
    console.log('[SCHEDULER] Story created:', story.id);

    console.log('[SCHEDULER] Step 2: Generating questions...');
    await questionGenerator.generate(story);
    console.log('[SCHEDULER] Questions created');

    console.log('[SCHEDULER] Step 3: Generating audio...');
    await audioGenerator.generate(story);
    console.log('[SCHEDULER] Audio created');

    await supabase
      .from('content_schedule')
      .update({
        status: 'review',
        story_id: story.id,
        generation_log: {
          story_generated: true,
          questions_generated: true,
          audio_generated: true,
          completed_at: new Date().toISOString()
        }
      })
      .eq('id', scheduleId);

    notify.logApprovalNotification(story.id, story.title);
    console.log('[SCHEDULER] Content generation complete - awaiting approval');

  } catch (error) {
    console.error('[SCHEDULER] Content generation failed:', error.message);
    
    await supabase
      .from('content_schedule')
      .update({
        status: 'failed',
        error_message: error.message
      })
      .eq('id', scheduleId);
  }
}

function start() {
  cron.schedule('0 6 * * 3,6', async () => {
    console.log('\n[CRON] Triggered at:', new Date().toISOString());
    await generateContent();
  });
  console.log('[SCHEDULER] Cron job scheduled');
}

async function runNow() {
  console.log('[SCHEDULER] Manual trigger');
  await generateContent();
}

module.exports = { start, runNow };
```

### 3. `notify.js`

**Path:** `~/projects/school-builder/worker/notify.js`

```javascript
function logApprovalNotification(storyId, storyTitle) {
  console.log('========================================');
  console.log('APPROVAL NOTIFICATION');
  console.log('========================================');
  console.log('Story ID:', storyId);
  console.log('Title:', storyTitle);
  console.log('Status: Ready for review');
  console.log('Time:', new Date().toISOString());
  console.log('========================================');
  console.log('ACTION REQUIRED: Review and approve in admin panel');
  console.log('========================================');
}

module.exports = { logApprovalNotification };
```

### 4. `client.js`

**Path:** `~/projects/school-builder/worker/supabase/client.js`

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
```

### 5. `storyGenerator.js`

**Path:** `~/projects/school-builder/worker/generators/storyGenerator.js`

```javascript
const axios = require('axios');
const supabase = require('../supabase/client');

const THEMES = [
  'friendship and teamwork',
  'curiosity and discovery',
  'courage and perseverance',
  'kindness and empathy',
  'problem-solving and creativity'
];

const SETTINGS = [
  'a magical forest school',
  'an underwater city',
  'a space station',
  'a village of inventors',
  'a mountain kingdom'
];

async function generate() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable');
  }

  const theme = THEMES[Math.floor(Math.random() * THEMES.length)];
  const setting = SETTINGS[Math.floor(Math.random() * SETTINGS.length)];

  console.log('[STORY] Theme:', theme);
  console.log('[STORY] Setting:', setting);

  const prompt = `You are writing a children's story for grades 3-6 (ages 8-12).

REQUIREMENTS:
- Theme: ${theme}
- Setting: ${setting}
- Exactly 5 chapters
- Each chapter: 800-1200 words
- Age-appropriate vocabulary and content
- Educational elements woven naturally into the story
- Memorable characters with distinct personalities
- Each chapter ends with a small cliffhanger or question (except the last)

FORMAT YOUR RESPONSE AS JSON:
{
  "title": "Story Title",
  "theme": "${theme}",
  "setting": "${setting}",
  "characters": [
    {"name": "Character Name", "description": "Brief description", "role": "protagonist/supporting/etc"}
  ],
  "chapters": [
    {
      "chapter_number": 1,
      "title": "Chapter Title",
      "content": "Full chapter text here...",
      "summary": "2-3 sentence summary"
    }
  ]
}

Write the complete story now.`;

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 16000,
      messages: [
        { role: 'user', content: prompt }
      ]
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    }
  );

  const content = response.data.content[0].text;
  
  // Parse JSON from response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse story JSON from Claude response');
  }
  
  const storyData = JSON.parse(jsonMatch[0]);

  // Insert story into database
  const { data: story, error: storyError } = await supabase
    .from('stories')
    .insert({
      title: storyData.title,
      theme: storyData.theme,
      setting: storyData.setting,
      characters: storyData.characters,
      total_chapters: storyData.chapters.length,
      status: 'pending'
    })
    .select()
    .single();

  if (storyError) {
    throw new Error(`Failed to insert story: ${storyError.message}`);
  }

  console.log('[STORY] Saved story:', story.id);

  // Insert chapters
  const chaptersToInsert = storyData.chapters.map(ch => ({
    story_id: story.id,
    chapter_number: ch.chapter_number,
    title: ch.title,
    content: ch.content,
    summary: ch.summary,
    questions_required: 3
  }));

  const { error: chaptersError } = await supabase
    .from('chapters')
    .insert(chaptersToInsert);

  if (chaptersError) {
    throw new Error(`Failed to insert chapters: ${chaptersError.message}`);
  }

  console.log('[STORY] Saved', chaptersToInsert.length, 'chapters');

  return {
    id: story.id,
    title: storyData.title,
    theme: storyData.theme,
    setting: storyData.setting,
    characters: storyData.characters,
    chapters: storyData.chapters
  };
}

module.exports = { generate };
```

### 6. `questionGenerator.js`

**Path:** `~/projects/school-builder/worker/generators/questionGenerator.js`

```javascript
const axios = require('axios');
const supabase = require('../supabase/client');

const BUILDINGS = [
  'Library',
  'Science Lab',
  'Art Studio',
  'Sports Field',
  'Music Room',
  'Cafeteria',
  'Computer Lab',
  'Garden',
  'Gymnasium',
  'Theater'
];

async function generate(story) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  
  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable');
  }

  const characterNames = story.characters.map(c => c.name).join(', ');

  const prompt = `You are creating math questions for a children's educational game (grades 3-6, ages 8-12).

STORY CONTEXT:
- Title: ${story.title}
- Theme: ${story.theme}
- Setting: ${story.setting}
- Characters: ${characterNames}

REQUIREMENTS:
- Create exactly 10 math questions
- Each question MUST reference characters or elements from the story
- Mix of difficulty levels: 4 easy, 4 medium, 2 hard
- Topics: addition, subtraction, multiplication, division, fractions, word problems
- Each question has 4 multiple choice options
- Include a brief explanation for the correct answer

FORMAT YOUR RESPONSE AS JSON:
{
  "questions": [
    {
      "building": "Library",
      "difficulty": "easy",
      "story_context": "How this connects to the story",
      "question": "The question text",
      "options": ["A", "B", "C", "D"],
      "answer": "The correct option exactly as written",
      "explanation": "Why this is correct"
    }
  ]
}

Available buildings for assignment: ${BUILDINGS.join(', ')}

Create the 10 questions now.`;

  const response = await axios.post(
    'https://api.anthropic.com/v1/messages',
    {
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [
        { role: 'user', content: prompt }
      ]
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      }
    }
  );

  const content = response.data.content[0].text;
  
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('Failed to parse questions JSON from Claude response');
  }
  
  const questionsData = JSON.parse(jsonMatch[0]);

  // Distribute questions across chapters (2 per chapter)
  const questionsToInsert = questionsData.questions.map((q, index) => ({
    story_id: story.id,
    chapter_number: Math.floor(index / 2) + 1,
    building: q.building,
    difficulty: q.difficulty,
    story_context: q.story_context,
    question: q.question,
    options: q.options,
    answer: q.answer,
    explanation: q.explanation
  }));

  const { error: questionsError } = await supabase
    .from('math_questions')
    .insert(questionsToInsert);

  if (questionsError) {
    throw new Error(`Failed to insert questions: ${questionsError.message}`);
  }

  console.log('[QUESTIONS] Saved', questionsToInsert.length, 'questions');

  return questionsToInsert;
}

module.exports = { generate };
```

### 7. `audioGenerator.js`

**Path:** `~/projects/school-builder/worker/generators/audioGenerator.js`

```javascript
const axios = require('axios');
const supabase = require('../supabase/client');

async function generate(story) {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable');
  }

  const { data: chapters, error: fetchError } = await supabase
    .from('chapters')
    .select('id, chapter_number, title, content')
    .eq('story_id', story.id)
    .order('chapter_number');

  if (fetchError) {
    throw new Error(`Failed to fetch chapters: ${fetchError.message}`);
  }

  console.log('[AUDIO] Generating audio for', chapters.length, 'chapters');

  for (const chapter of chapters) {
    console.log('[AUDIO] Processing chapter', chapter.chapter_number);

    const textToSpeak = `Chapter ${chapter.chapter_number}: ${chapter.title}. ${chapter.content}`;

    const response = await axios.post(
      'https://api.openai.com/v1/audio/speech',
      {
        model: 'tts-1',
        voice: 'fable',
        input: textToSpeak
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer'
      }
    );

    const audioBuffer = Buffer.from(response.data);
    const fileName = `${story.id}/chapter-${chapter.chapter_number}.mp3`;

    const { error: uploadError } = await supabase.storage
      .from('audio')
      .upload(fileName, audioBuffer, {
        contentType: 'audio/mpeg',
        upsert: true
      });

    if (uploadError) {
      console.error('[AUDIO] Upload failed for chapter', chapter.chapter_number, uploadError);
      continue;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('audio')
      .getPublicUrl(fileName);

    await supabase
      .from('chapters')
      .update({ audio_url: publicUrl })
      .eq('id', chapter.id);

    await supabase
      .from('audio_files')
      .insert({
        chapter_id: chapter.id,
        file_url: publicUrl,
        file_size_bytes: audioBuffer.length,
        voice: 'fable'
      });

    console.log('[AUDIO] Saved chapter', chapter.chapter_number);
  }

  console.log('[AUDIO] All chapters processed');
}

module.exports = { generate };
```

---

## How to Run

1. **Install dependencies**:
   ```bash
   cd ~/projects/school-builder/worker
   npm install axios node-cron @supabase/supabase-js
   ```

2. **Run the worker**:
   ```bash
   node index.js
   ```

   Ensure your environment variables (`SUPABASE_URL`, `SUPABASE_SERVICE_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`) are set.

---

## Dependencies Added

- `axios` for HTTP requests
- `node-cron` for scheduling tasks
- `@supabase/supabase-js` for Supabase client

---

## What to Check

- Verify all files are created at the specified paths.
- Ensure all environment variables are correctly set.
- Run the worker and check logs for successful execution.
- Check for any errors during the cron job execution.

---

**All files for the content worker are ready. Let me know if further assistance is needed!**
# BACKEND

# Execution Plan

---

## Task

Create the content worker for the `school-builder` project with the following files:

1. **index.js** — Entry point
2. **scheduler.js** — Cron job setup
3. **generators/storyGenerator.js** — Generate a story using Claude
4. **generators/questionGenerator.js** — Generate math questions using Claude
5. **generators/audioGenerator.js** — Generate audio using OpenAI TTS
6. **supabase/client.js** — Supabase client with service role key
7. **notify.js** — Logs approval notification

---

## Directory Structure

**Location:** `~/projects/school-builder/worker/`

```
worker/
|-- index.js
|-- scheduler.js
|-- generators/
|   |-- storyGenerator.js
|   |-- questionGenerator.js
|   |-- audioGenerator.js
|-- supabase/
|   |-- client.js
|-- notify.js
```

---

## File Contents

### 1. `index.js`

```javascript
const scheduler = require('./scheduler');

console.log('Content Worker Started');
scheduler.start();
```

### 2. `scheduler.js`

```javascript
const cron = require('node-cron');
const storyGenerator = require('./generators/storyGenerator');
const questionGenerator = require('./generators/questionGenerator');
const audioGenerator = require('./generators/audioGenerator');

function start() {
  cron.schedule('0 6 * * 3,6', async () => {
    console.log('Scheduled task started');
    try {
      const story = await storyGenerator.generate();
      const questions = await questionGenerator.generate(story);
      await audioGenerator.generate(story);
      console.log('Content generation complete');
    } catch (error) {
      console.error('Error during scheduled task:', error);
    }
  });
}

module.exports = { start };
```

### 3. `generators/storyGenerator.js`

```javascript
const axios = require('axios');

async function generate() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const response = await axios.post('https://api.anthropic.com/v1/claude', {
    prompt: 'Generate a 5-chapter story with each chapter 800-1200 words.',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

module.exports = { generate };
```

### 4. `generators/questionGenerator.js`

```javascript
const axios = require('axios');

async function generate(story) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  const response = await axios.post('https://api.anthropic.com/v1/claude', {
    prompt: `Generate 10 math questions themed to this story: ${story}`,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

module.exports = { generate };
```

### 5. `generators/audioGenerator.js`

```javascript
const axios = require('axios');

async function generate(story) {
  const apiKey = process.env.OPENAI_API_KEY;
  const response = await axios.post('https://api.openai.com/v1/audio', {
    text: story,
    voice: 'fable',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

module.exports = { generate };
```

### 6. `supabase/client.js`

```javascript
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

module.exports = supabase;
```

### 7. `notify.js`

```javascript
function logApprovalNotification(message) {
  console.log(`Approval Notification: ${message}`);
}

module.exports = { logApprovalNotification };
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
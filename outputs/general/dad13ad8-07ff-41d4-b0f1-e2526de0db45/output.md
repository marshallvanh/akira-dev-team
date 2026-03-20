# TETSUO

# What I Understood

You want the story content to rotate — your son shouldn't see the same story for at least 3 days after completing it. Fresh content keeps him engaged.

---

# Mode

**SPEC CLARIFICATION MODE** — Defining story rotation logic

---

# Story Rotation System

## The Rule

> Once a story is completed, it doesn't appear again for at least 3 days.

## How It Works

| Scenario | What Happens |
|----------|--------------|
| **Son finishes "Max's Moon Mission"** | Story locked for 3 days |
| **Day 1-3** | Other stories available, not Max's Moon Mission |
| **Day 4** | Max's Moon Mission available again |
| **Son hasn't finished a story** | Can continue where he left off anytime |

## Logic

```javascript
{
  storyId: "max_moon_mission",
  status: "completed",
  completedDate: "2025-01-15",
  availableAgain: "2025-01-18",  // 3 days later
  chaptersCompleted: [1, 2, 3, 4],
  timesCompleted: 2
}
```

## Content Requirement

For this to work, we need enough stories so there's always something fresh:

| Rotation Period | Minimum Stories Needed |
|-----------------|------------------------|
| **3 days** | 4 stories minimum |
| **Comfortable buffer** | 6+ stories recommended |

---

# Two Options

## Option A: 3-Day Lockout (Your Request)

- Story completed → locked 3 days
- Need 4+ stories at launch
- Same story can repeat after lockout ends

## Option B: Full Rotation

- Story completed → goes to back of queue
- All other stories must be read first
- Story only repeats when all others are done
- Need more stories but maximum variety

---

# My Recommendation

**Option A** with 6 stories at launch:

| Story | Theme |
|-------|-------|
| 1 | Space adventure |
| 2 | Mystery/detective |
| 3 | Animals/nature |
| 4 | Sports/competition |
| 5 | Friendship/school |
| 6 | History/time travel |

This gives your son variety and ensures he always has 3+ fresh options even if he reads one story per day.

---

# One Question

| # | Question |
|---|----------|
| **1** | Option A (3-day lockout) or Option B (full rotation)? |

Once confirmed, I'll update the spec and continue with Build 1.

---

# ARCHITECT

# What I Understood

You want the story content to rotate — your son shouldn't see the same story for at least 3 days. Fresh content keeps him engaged.

---

# Mode

**SPEC CLARIFICATION MODE** — Defining story rotation system

---

# Story Rotation System

| Rule | Detail |
|------|--------|
| **Rotation period** | 3 days minimum before a story repeats |
| **Selection** | System picks from available stories, excluding recently read |
| **Tracking** | App stores last-read date for each story |
| **Fallback** | If all stories read within 3 days, show least recent |

---

# How It Works

```
Day 1: Kid reads "Max's Moon Mission"
Day 2: Kid reads "The Great Forest Race"
Day 3: Kid reads "The Talking River"
Day 4: "Max's Moon Mission" available again
```

**Story Pool Needed:**

| Stories Available | Rotation Works? |
|-------------------|-----------------|
| 2 stories | No — would repeat on day 3 |
| 3 stories | Barely — tight rotation |
| 5+ stories | Yes — comfortable rotation |
| 10+ stories | Ideal — variety feels fresh |

---

# Data Model Update

```javascript
// Track when each story was last read
{
  storyHistory: [
    { storyId: "moon_mission", lastReadDate: "2025-01-15" },
    { storyId: "forest_race", lastReadDate: "2025-01-14" },
    { storyId: "talking_river", lastReadDate: "2025-01-13" }
  ]
}
```

---

# Story Selection Logic

```javascript
function selectStory(allStories, storyHistory) {
  const today = new Date();
  const threeDaysAgo = subtractDays(today, 3);
  
  // Filter out stories read in last 3 days
  const available = allStories.filter(story => {
    const history = storyHistory.find(h => h.storyId === story.id);
    if (!history) return true; // Never read, available
    return new Date(history.lastReadDate) < threeDaysAgo;
  });
  
  // If all stories read recently, pick the oldest one
  if (available.length === 0) {
    return storyHistory.sort((a, b) => 
      new Date(a.lastReadDate) - new Date(b.lastReadDate)
    )[0].storyId;
  }
  
  // Pick random from available
  return available[Math.floor(Math.random() * available.length)];
}
```

---

# Content Implication

For 3-day rotation to feel fresh, we need more stories at launch:

| Build | Stories | Rotation Feel |
|-------|---------|---------------|
| **Build 3** (Reading Mode) | 5 stories | Workable |
| **Build 4** | 10 stories | Good |
| **Full MVP** | 20 stories | Excellent |

---

# One Question

When your son opens Reading Mode, should he:

| Option | Experience |
|--------|------------|
| **A** | App picks the story for him (auto-rotation) |
| **B** | He chooses from available stories (but recently-read are locked/greyed) |
| **C** | He chooses freely, but app suggests "NEW!" or "Try this one!" |

Which feels right?
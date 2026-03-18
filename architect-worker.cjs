const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-haiku-4-5";

function cleanJson(text) {
  return String(text || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function normalizeTask(task, fallbackIndex = 1) {
  return {
    title: task?.title || `Task ${fallbackIndex}`,
    description: task?.description || "Complete this part of the build.",
    deliverable: task?.deliverable || "A finished implementation outcome"
  };
}

function buildFallbackPlan(projectIdea) {
  return {
    project_name: "New Project",
    project_summary: `A software project based on this idea: ${projectIdea}`,
    target_user: "General users",
    milestone: "Milestone 1 - MVP foundation",
    tasks: [
      {
        title: "Define MVP scope",
        description: "Clarify the exact first-version features, core user flow, and what will be intentionally left out of the MVP.",
        deliverable: "A written MVP scope and user flow summary"
      },
      {
        title: "Set up project structure",
        description: "Create the initial codebase structure, folders, and foundational setup needed for the application.",
        deliverable: "A working project scaffold with core folders and starter files"
      },
      {
        title: "Design data model",
        description: "Define the main entities, fields, and relationships required for the app's core functionality.",
        deliverable: "A documented data model or schema draft for the MVP"
      },
      {
        title: "Build core backend logic",
        description: "Implement the main backend functionality required to support the primary app workflow.",
        deliverable: "Core backend logic or service layer for the MVP"
      },
      {
        title: "Build first user interface",
        description: "Create the first usable screens for the main app flow so the product can be interacted with.",
        deliverable: "A basic working UI for the core user journey"
      },
      {
        title: "Connect frontend and backend",
        description: "Link the interface to the underlying logic so the first end-to-end workflow can function.",
        deliverable: "A connected MVP flow that works across the stack"
      },
      {
        title: "Test and review MVP",
        description: "Check the first version for broken flows, missing pieces, and obvious quality issues.",
        deliverable: "A test/review summary with fixes or follow-up tasks"
      }
    ]
  };
}

async function brainstormIdea(projectIdea) {
  const prompt = `
You are a thoughtful product strategist and software architect helping a founder shape an app idea.

The founder is early in the thinking process.
Respond like a smart, practical coworker.

Your job:
- reflect back what you think the idea is
- suggest a sensible MVP
- mention 2 or 3 strong features worth considering
- mention 1 or 2 risks or things to keep simple
- ask up to 2 useful clarifying questions
- keep it practical, collaborative, and concise

Idea:
${projectIdea}
`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return (response.content?.[0]?.text || "This sounds promising. Let’s shape the MVP first.").trim();
}

async function createPlan(projectIdea) {
  const prompt = `
You are a senior software architect designing a first-stage build plan for an AI development team.

Turn this app idea into a practical MVP project plan.

App idea:
${projectIdea}

Return ONLY valid JSON in this exact format:

{
  "project_name": "short clear project name",
  "project_summary": "2-3 sentence explanation of what the app is and what it should do",
  "target_user": "who this app is for",
  "milestone": "Milestone 1 - ...",
  "tasks": [
    {
      "title": "short task title",
      "description": "clear explanation of the task",
      "deliverable": "what should exist when this task is done"
    }
  ]
}

Rules:
- create between 6 and 8 tasks
- tasks must be practical and sequential
- tasks must describe a realistic MVP build order
- the tasks should usually move through this kind of flow:
  1. scope / planning
  2. project setup
  3. data / backend foundations
  4. core backend logic
  5. frontend / UI
  6. integration
  7. testing / QA
  8. polish if appropriate
- do not create vague filler tasks
- do not collapse the whole app into one or two giant tasks
- milestone should sound clear and professional
- keep the project name short and usable
- output JSON only
`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1400,
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const text = cleanJson(response.content?.[0]?.text || "");

  try {
    const parsed = JSON.parse(text);

    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid plan object");
    }

    if (!Array.isArray(parsed.tasks) || parsed.tasks.length < 4) {
      throw new Error("Insufficient tasks returned");
    }

    parsed.project_name = parsed.project_name || "Untitled Project";
    parsed.project_summary = parsed.project_summary || "A new app concept that needs structured planning.";
    parsed.target_user = parsed.target_user || "General users";
    parsed.milestone = parsed.milestone || "Milestone 1 - MVP foundation";
    parsed.tasks = parsed.tasks.slice(0, 8).map((task, index) => normalizeTask(task, index + 1));

    return parsed;
  } catch {
    return buildFallbackPlan(projectIdea);
  }
}

module.exports = {
  brainstormIdea,
  createPlan
};

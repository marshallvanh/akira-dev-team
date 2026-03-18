const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");

const akira = require("./akira-core.cjs");
const tetsuo = require("./tetsuo-worker.cjs");
const backendWorker = require("./backend-worker.cjs");
const frontendWorker = require("./frontend-worker.cjs");
const architect = require("./architect-worker.cjs");
const reviewer = require("./reviewer-worker.cjs");
const researchWorker = require("./research-worker.cjs");
const cto = require("./cto-agent.cjs");
const brainstormEngine = require("./brainstorm-engine.cjs");
const artifactEngine = require("./artifact-engine.cjs");
const conversationMemory = require("./conversation-memory.cjs");
const mediaMemory = require("./media-memory.cjs");
const { detectResetIntent, resetProjectState } = require("./project-reset.cjs");
const { safeClaudeCall } = require("./safe-claude.cjs");
const { decideIntent } = require("./intelligence-layer.cjs");

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "akira-chief-of-staff",
  }),
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage"
    ],
  },
});

const WORKSPACE = path.join(__dirname, "workspace");
const MANIFEST_FILE = path.join(WORKSPACE, "build-manifest.json");
const AUTO_TASK_LIMIT = 3;

const DISPLAY_NAMES = {
  "Akira": "Akira",
  "CTO": "Kaneda",
  "Research Worker": "Lucy",
  "Backend Worker": "Tetsuo",
  "Frontend Worker": "Rebecca",
  "QA Tester": "Kiwi",
  "Reviewer": "Kiwi",
  "Architect": "Kei",
  "Tetsuo": "Tetsuo"
};

function displayName(name) {
  return DISPLAY_NAMES[name] || name;
}

function normalized(text) {
  return String(text || "").trim().toLowerCase();
}

function shortText(text, max = 180) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  if (!value) return "";
  if (value.length <= max) return value;
  return value.slice(0, max - 3).trim() + "...";
}

function bulletList(items, maxItems = 3, maxItemLength = 120) {
  if (!Array.isArray(items) || items.length === 0) return "None";
  return items
    .slice(0, maxItems)
    .map((item) => `- ${shortText(item, maxItemLength)}`)
    .join("\n");
}

function formatProjectState() {
  const state = akira.getState();
  const activeIdea = conversationMemory.getActiveIdea();

  return [
    `Project: ${state.project_name || "Not started"}`,
    `Summary: ${state.project_summary || "None yet"}`,
    `Target user: ${state.target_user || "Not defined"}`,
    `Milestone: ${state.milestone || "Not set"}`,
    `Status: ${state.status || "idle"}`,
    `Current focus: ${state.current_focus || "None"}`,
    `Next action: ${state.next_action || "None"}`,
    `Active idea: ${activeIdea.idea || "None"}`,
    `Open tasks: ${Array.isArray(state.tasks) ? state.tasks.length : 0}`,
    `Completed tasks: ${Array.isArray(state.completed_tasks) ? state.completed_tasks.length : 0}`,
    `Blocked tasks: ${Array.isArray(state.blocked_tasks) ? state.blocked_tasks.length : 0}`
  ].join("\n");
}

function extractReviewSummaryFromDescription(description) {
  const text = String(description || "");
  const match = text.match(/Review summary:\s*([\s\S]*?)(?:\n\nRequired changes:|\nRequired changes:|$)/i);
  return match ? shortText(match[1], 180) : "";
}

function extractRequiredChanges(description) {
  const text = String(description || "");
  const match = text.match(/Required changes:\s*([\s\S]*?)$/i);

  if (!match) return [];

  return match[1]
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => line.replace(/^-+\s*/, ""))
    .map((line) => line.replace(/^•\s*/, ""))
    .filter(Boolean);
}

function formatCompactTask(task) {
  const changes = extractRequiredChanges(task.description);
  const summary = extractReviewSummaryFromDescription(task.description);
  const keyIssue = changes.length > 0 ? shortText(changes[0], 120) : "No key issue recorded";
  const nextStep = shortText(task.deliverable || "Continue working this task", 140);

  return [
    `${task.id} — ${task.title}`,
    `Status: Open`,
    `Summary: ${summary || "Task is waiting for execution."}`,
    `Key issue: ${keyIssue}`,
    `Next step: ${nextStep}`
  ].join("\n");
}

function formatCompactCompletedTask(task) {
  return [
    `${task.id} — ${task.title}`,
    `Status: Completed`,
    `Deliverable: ${shortText(task.deliverable || "No deliverable", 140)}`
  ].join("\n");
}

function formatCompactBlockedTask(task) {
  return [
    `${task.id} — ${task.title}`,
    `Status: Blocked`,
    `Reason: ${shortText(task.block_reason || "Blocked", 160)}`
  ].join("\n");
}

function formatDevStatus() {
  const state = akira.getState();

  const openTasks = Array.isArray(state.tasks) ? state.tasks : [];
  const completedTasks = Array.isArray(state.completed_tasks) ? state.completed_tasks : [];
  const blockedTasks = Array.isArray(state.blocked_tasks) ? state.blocked_tasks : [];
  const sortedOpen = cto.sortTasksForExecution(openTasks);

  if (openTasks.length === 0 && completedTasks.length === 0 && blockedTasks.length === 0) {
    return "No dev work tracked yet.";
  }

  let reply = "Dev Team Status\n\n";

  if (sortedOpen.length > 0) {
    reply += "Open Tasks\n";
    reply += sortedOpen.slice(0, 6).map(formatCompactTask).join("\n\n");
    reply += "\n\n";
  }

  if (blockedTasks.length > 0) {
    reply += "Blocked Tasks\n";
    reply += blockedTasks.slice(-4).reverse().map(formatCompactBlockedTask).join("\n\n");
    reply += "\n\n";
  }

  if (completedTasks.length > 0) {
    reply += "Recently Completed\n";
    reply += completedTasks.slice(-4).reverse().map(formatCompactCompletedTask).join("\n\n");
  }

  return reply.trim();
}

function formatWorkerReports() {
  const reports = akira.getWorkerReports();

  if (!Array.isArray(reports) || reports.length === 0) {
    return "No worker reports yet.";
  }

  return (
    "Worker Reports\n\n" +
    reports
      .slice(-5)
      .reverse()
      .map((report) => {
        const worker = displayName(report.worker || "Worker");
        return `${report.task_id} — ${worker}\n${shortText(report.report, 500)}`;
      })
      .join("\n\n")
  );
}

function formatReviews() {
  const reviews = akira.getReviews();

  if (!Array.isArray(reviews) || reviews.length === 0) {
    return "No reviews yet.";
  }

  return (
    "Review Reports\n\n" +
    reviews
      .slice(-5)
      .reverse()
      .map((review) => {
        return (
          `${review.task_id}\n` +
          `Decision: ${review.decision}\n` +
          `Summary: ${shortText(review.summary, 220)}\n` +
          `Issues:\n${bulletList(review.issues, 3, 120)}\n` +
          `Next action: ${shortText(review.next_action, 180)}`
        );
      })
      .join("\n\n")
  );
}

function formatManifest() {
  if (!fs.existsSync(MANIFEST_FILE)) {
    return "No build files yet.";
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));

    if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
      return "No build files yet.";
    }

    return (
      "Build Files\n\n" +
      manifest.files
        .slice(-20)
        .map((file) => file.path)
        .join("\n")
    );
  } catch {
    return "Could not read build manifest.";
  }
}

function isBuildConfirmation(text, state) {
  const value = normalized(text);
  if (!state || !state.draft_project_idea) return false;

  const phrases = [
    "ok build it",
    "okay build it",
    "build it",
    "lets build it",
    "let's build it",
    "turn that into a project",
    "turn it into a project",
    "go ahead and build it",
    "yes build it",
    "start the project",
    "create the project"
  ];

  return phrases.includes(value);
}

function isDirectStatusCommand(text) {
  const value = normalized(text);

  return {
    projectState: ["project state", "state", "akira state"].includes(value),
    devStatus: ["dev status", "akira dev status"].includes(value),
    reports: ["reports", "tetsuo reports", "worker reports"].includes(value),
    reviews: ["reviews", "review reports"].includes(value),
    buildFiles: ["build files", "what files have been built"].includes(value),
    reviewLatest: ["review latest", "review the latest work"].includes(value),
    ctoRun: ["cto run", "cto", "cto next"].includes(value)
  };
}

function extractResearchQuery(text) {
  const value = String(text || "").trim();

  return value
    .replace(/^research\s+/i, "")
    .replace(/^look up\s+/i, "")
    .replace(/^investigate\s+/i, "")
    .replace(/^researcher\s+/i, "")
    .trim();
}

function refersToRecentImage(text) {
  const value = normalized(text);

  return (
    value.includes("image") ||
    value.includes("photo") ||
    value.includes("picture") ||
    value.includes("uploaded") ||
    value.includes("can you see this") ||
    value.includes("can you see the image") ||
    value.includes("what do you think this is") ||
    value.includes("is this the leak") ||
    value.includes("look at this")
  );
}

async function analyzeImageWithAkira(userText, imageInfo, state, activeIdea) {
  if (!imageInfo || !imageInfo.path || !fs.existsSync(imageInfo.path)) {
    return {
      ok: false,
      error: "I couldn't find a recent image to inspect."
    };
  }

  const base64 = fs.readFileSync(imageInfo.path, { encoding: "base64" });

  const response = await safeClaudeCall({
    max_tokens: 450,
    system: `
You are Akira.

Marshall's Chief of Staff.

You are helping inspect an uploaded image.

Current project state:
${JSON.stringify({
  project_name: state.project_name || "",
  milestone: state.milestone || "",
  current_focus: state.current_focus || "",
  next_action: state.next_action || "",
  open_tasks: Array.isArray(state.tasks) ? state.tasks.length : 0
}, null, 2)}

Current active idea:
${activeIdea.idea || "None"}

Rules:
- Answer naturally and conversationally
- Be specific about what you can see
- If the image suggests a vehicle/mechanical issue, mention likely causes and sensible next checks
- If uncertain, say what is visible and what would confirm it
- Do not pretend certainty if the image is ambiguous
`,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: imageInfo.mimetype || "image/jpeg",
              data: base64
            }
          },
          {
            type: "text",
            text: userText || "Please inspect this image and tell me what you can see."
          }
        ]
      }
    ]
  });

  if (!response.ok) {
    return {
      ok: false,
      error: response.error || "Image analysis failed."
    };
  }

  return {
    ok: true,
    reply: String(response.text || "").trim()
  };
}

function getTaskWorker(task) {
  const workerName = cto.chooseWorker(task);

  switch (workerName) {
    case "Research Worker":
      return { label: "Research Worker", runner: researchWorker, type: "research" };
    case "Frontend Worker":
      return { label: "Frontend Worker", runner: frontendWorker, type: "build" };
    case "Backend Worker":
      return { label: "Backend Worker", runner: backendWorker, type: "build" };
    case "QA Tester":
      return { label: "QA Tester", runner: null, type: "qa" };
    default:
      return { label: "Tetsuo", runner: tetsuo, type: "build" };
  }
}

async function runTaskWithAssignedWorker(task) {
  const assigned = getTaskWorker(task);

  if (assigned.type === "qa") {
    return {
      workerLabel: assigned.label,
      ok: false,
      taskId: task?.id || "",
      error: "QA Tester is a review role and should not be used as the primary builder for this task."
    };
  }

  if (assigned.type === "research") {
    const query = `${task.title}\n\n${task.description}\n\nDeliverable: ${task.deliverable}`;
    const researchResult = await researchWorker.runResearch(query);

    if (!researchResult.ok) {
      return {
        workerLabel: assigned.label,
        ok: false,
        taskId: task?.id || "",
        error: researchResult.error || "Research worker failed"
      };
    }

    const output = `[Research Worker]\n\nSUMMARY:\nResearch task completed\n\nIMPLEMENTATION:\n${researchResult.research}\n\nFILES:\nNo files created\n\nNEXT STEP:\nReview findings and continue\n\nBLOCKERS:\nNone`;

    if (typeof akira.addWorkerReport === "function") {
      akira.addWorkerReport(task.id, output, "Research Worker");
    }

    if (typeof akira.completeTask === "function") {
      akira.completeTask(task.id, output);
    }

    return {
      workerLabel: assigned.label,
      ok: true,
      taskId: task.id,
      output,
      files: []
    };
  }

  const result = await assigned.runner.runTask(task);

  return {
    workerLabel: assigned.label,
    ...result
  };
}

async function reviewCompletedTask(result) {
  const task = akira.getTaskById(result.taskId);

  if (!task) {
    return null;
  }

  const review = await reviewer.reviewTask({
    projectState: akira.getState(),
    task,
    report: result.output
  });

  akira.addReview(task.id, review);

  if (typeof akira.setNextAction === "function") {
    akira.setNextAction(review.next_action || "Review next task");
  }

  let revisionTask = null;

  if (
    String(review.decision).toLowerCase() === "revise" &&
    typeof akira.createRevisionTask === "function"
  ) {
    revisionTask = akira.createRevisionTask(task, review);

    if (typeof akira.setNextAction === "function") {
      akira.setNextAction(`Revision required for ${task.id} via ${revisionTask.id}`);
    }
  }

  return {
    review,
    revisionTask
  };
}

async function reviewLatestWork() {
  const reviews = akira.getReviews();
  const latest = Array.isArray(reviews) ? reviews[reviews.length - 1] : null;

  if (!latest) {
    return "There’s nothing reviewed yet.";
  }

  let reply =
    `Latest review for ${latest.task_id}\n\n` +
    `Decision: ${latest.decision}\n` +
    `Summary: ${shortText(latest.summary, 220)}\n` +
    `Issues:\n${bulletList(latest.issues, 3, 120)}\n` +
    `Next action: ${shortText(latest.next_action, 180)}`;

  const state = akira.getState();
  const tasks = Array.isArray(state.tasks) ? state.tasks : [];
  const revisionTask = tasks.find(
    (t) =>
      t.parent_task_id &&
      String(t.parent_task_id).toLowerCase() === String(latest.task_id).toLowerCase()
  );

  if (revisionTask) {
    reply += `\n\nRevision task created:\n${revisionTask.id} — ${revisionTask.title}`;
  }

  return reply;
}

function summarizeExecutionForFounder(result, reviewed) {
  const decision = String(reviewed?.review?.decision || "approve").toLowerCase();
  const status =
    decision === "revise"
      ? "Needs revision"
      : decision === "approve"
      ? "Completed"
      : "In progress";

  const worker = displayName(result.workerLabel);
  let reply = `${worker} finished ${result.taskId}\n\n`;
  reply += `Status: ${status}\n`;

  if (Array.isArray(result.files) && result.files.length > 0) {
    reply += `Created:\n${bulletList(result.files, 4, 90)}\n`;
  } else {
    reply += `Created:\n- No files created\n`;
  }

  if (decision === "revise") {
    const issues = Array.isArray(reviewed?.review?.issues) ? reviewed.review.issues : [];
    reply += `Top issues:\n${bulletList(issues, 3, 110)}\n`;

    if (reviewed?.revisionTask) {
      reply += `Revision queued:\n- ${reviewed.revisionTask.id}\n`;
    }

    if (reviewed?.review?.next_action) {
      reply += `Next step:\n${shortText(reviewed.review.next_action, 140)}\n`;
    }
  } else if (reviewed?.review?.summary) {
    reply += `Outcome:\n${shortText(reviewed.review.summary, 180)}\n`;
  }

  reply += `Founder action:\nNone needed right now`;

  return reply;
}

async function handleResearch(message, originalMessage) {
  const query = extractResearchQuery(originalMessage);

  if (!query) {
    const reply = "Tell me what you want researched.";
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  await message.reply(`Got it — ${displayName("Research Worker")} is investigating:\n${query}`);

  const result = await researchWorker.runResearch(query);

  if (!result.ok) {
    const reply = `${displayName("Research Worker")} couldn't complete that.\nReason: ${result.error}`;
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  conversationMemory.addEntry("Akira", result.research);
  await message.reply(result.research);
  return true;
}

async function sendArtifactFiles(chatId, artifact) {
  if (!Array.isArray(artifact.absoluteFiles) || artifact.absoluteFiles.length === 0) {
    return;
  }

  for (const file of artifact.absoluteFiles) {
    if (!fs.existsSync(file)) continue;

    try {
      const ext = path.extname(file).toLowerCase();
      const media = MessageMedia.fromFilePath(file);

      await client.sendMessage(chatId, media, {
        sendMediaAsDocument: ![".png", ".jpg", ".jpeg", ".webp"].includes(ext),
        caption: path.basename(file)
      });
    } catch (err) {
      console.log("Artifact send error:", err.message || err);
    }
  }
}

async function handleArtifactRequest(message, originalMessage) {
  const activeIdea = conversationMemory.getActiveIdea();
  const contextIdea = activeIdea.idea || "";

  await message.reply(`Akira\nGot it — I’m asking ${displayName("Architect")} to draw that up.`);

  const artifact = await artifactEngine.createArtifact(originalMessage, contextIdea);

  if (!artifact.ok) {
    const reply = artifact.error || "Akira couldn't create that artifact.";
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  await sendArtifactFiles(message.from, artifact);

  const reply =
    `Akira\n${artifact.summary}\n\nDelivered file:\n${artifact.files.join("\n")}\n\nType:\n${artifact.type}`;

  conversationMemory.addEntry("Akira", reply);
  await message.reply(reply);
  return true;
}

async function handleBrainstorm(message, idea) {
  const activeIdea = conversationMemory.getActiveIdea();
  const contextIdea = activeIdea.idea || "";
  const storedIdea = idea || contextIdea;

  if (storedIdea) {
    conversationMemory.setActiveIdea(storedIdea);
  }

  const result = await brainstormEngine.brainstorm(idea, contextIdea);

  const reply =
    `${result.akira}\n\n` +
    `Quick team take\n` +
    `${displayName("Research Worker")}: ${result.lucy}\n` +
    `${displayName("Architect")}: ${result.kei}\n` +
    `${displayName("CTO")}: ${result.kaneda}\n\n` +
    `You can keep chatting naturally, say "ok build it", or ask me to create a flowchart, workflow, roadmap, wireframe, or graph.`;

  conversationMemory.addEntry("Akira", reply);
  await message.reply(reply);
}

async function handleForgetIdea(message) {
  const activeIdea = conversationMemory.getActiveIdea();

  if (!activeIdea.idea) {
    const reply = "Akira\nThere isn’t an active idea stored right now.";
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  conversationMemory.clearActiveIdea();
  const reply = `Akira\nDone — I forgot the active idea:\n${activeIdea.idea}`;
  conversationMemory.addEntry("Akira", reply);
  await message.reply(reply);
  return true;
}

async function handleForgetAllMemory(message) {
  conversationMemory.clearAllMemory();
  mediaMemory.clearLatestImage();
  await message.reply("Akira\nDone — I cleared all stored conversation memory.");
  return true;
}

async function handleFounderReset(message, originalMessage) {
  const intent = detectResetIntent(originalMessage);

  if (!intent) {
    return false;
  }

  const result = resetProjectState(intent);
  const reply = `Akira: ${result.message}`;
  conversationMemory.addEntry("Akira", reply);
  await message.reply(reply);
  return true;
}

async function handleCtoRun(message) {
  const step = cto.getNextExecutionStep();

  if (step.action === "idle") {
    const reply = step.message;
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  const task = step.task;

  await message.reply(
`${displayName("CTO")} executing task

Task:
${task.id} — ${task.title}

Assigned Worker:
${displayName(step.worker)}`
  );

  const assigned = getTaskWorker(task);

  if (assigned.type === "qa") {
    const reply =
`${displayName("CTO")} paused execution

Reason:
${displayName(step.worker)} is a review role, not a build worker.`;
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  const result = await runTaskWithAssignedWorker(task);

  if (!result.ok) {
    const reply =
`${displayName(assigned.label)} couldn't complete ${task.id}

Reason:
${result.error}`;
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  const reviewed = await reviewCompletedTask(result);
  const reply = summarizeExecutionForFounder(result, reviewed);
  conversationMemory.addEntry("Akira", reply);
  await message.reply(reply);
  return true;
}

async function handleDirectTaskRun(message, originalMessage) {
  if (!normalized(originalMessage).startsWith("run task ")) {
    return false;
  }

  const taskId = originalMessage.slice("run task ".length).trim();
  const task = akira.getTaskById(taskId);

  if (!task) {
    const reply = `I couldn't find ${taskId}.`;
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  if (task.status !== "pending") {
    const reply = `${task.id} is not pending. Current status: ${task.status}`;
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  const assigned = getTaskWorker(task);

  if (assigned.type === "qa") {
    const reply = `${displayName(assigned.label)} is a review role and can't be used as the primary builder for ${task.id}.`;
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  await message.reply(`Got it — ${displayName(assigned.label)} is starting ${task.id}.`);

  const result = await runTaskWithAssignedWorker(task);

  if (!result.ok) {
    const reply = `${displayName(result.workerLabel)} couldn't complete ${task.id}.\nReason: ${result.error}`;
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  const reviewed = await reviewCompletedTask(result);
  const reply = summarizeExecutionForFounder(result, reviewed);
  conversationMemory.addEntry("Akira", reply);
  await message.reply(reply);
  return true;
}

async function handleBuildProject(message, idea) {
  await message.reply(`Got it — I’m getting ${displayName("Architect")} to turn that into a proper project plan.`);

  const plan = await architect.createPlan(idea);

  akira.startProject(plan);

  const createdTasks = [];
  for (const taskInput of plan.tasks) {
    const task = akira.createTask(taskInput);
    createdTasks.push(task);
  }

  const reply =
    `Project created\n\n` +
    `Name: ${plan.project_name}\n` +
    `Summary: ${plan.project_summary}\n` +
    `Target user: ${plan.target_user}\n` +
    `Milestone: ${plan.milestone}\n\n` +
    `Tasks\n\n` +
    createdTasks
      .map(
        (task) =>
          `${task.id} — ${task.title}\nDescription: ${task.description || "No description"}\nDeliverable: ${task.deliverable || "No deliverable"}`
      )
      .join("\n\n");

  conversationMemory.addEntry("Akira", reply);
  await message.reply(reply);
}

client.on("qr", (qr) => {
  console.log("\nScan the QR code below with WhatsApp\n");
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Akira Dev Team Core is online");
});

client.on("authenticated", () => {
  console.log("WhatsApp authenticated");
});

client.on("message", async (message) => {
  try {
    if (message.fromMe) return;

    const originalMessage = String(message.body || "").trim();

    const state = akira.getState();
    const activeIdea = conversationMemory.getActiveIdea();

    let downloadedMedia = null;

    if (message.hasMedia) {
      try {
        downloadedMedia = await message.downloadMedia();

        if (downloadedMedia && String(downloadedMedia.mimetype || "").startsWith("image/")) {
          mediaMemory.saveLatestImage(downloadedMedia);
        }
      } catch (err) {
        console.log("Media download error:", err.message || err);
      }
    }

    if (originalMessage) {
      akira.saveMemory(originalMessage);
      conversationMemory.addEntry("Marshall", originalMessage);
    } else if (downloadedMedia && String(downloadedMedia.mimetype || "").startsWith("image/")) {
      conversationMemory.addEntry("Marshall", "[Uploaded image]");
    }

    if (await handleFounderReset(message, originalMessage)) {
      return;
    }

    if (downloadedMedia && String(downloadedMedia.mimetype || "").startsWith("image/")) {
      const latestImage = mediaMemory.getLatestImage();
      const imagePrompt = originalMessage || "Please inspect this image and tell me what you can see.";

      const inspected = await analyzeImageWithAkira(imagePrompt, latestImage, state, activeIdea);

      if (!inspected.ok) {
        const reply = inspected.error || "I couldn't inspect that image properly.";
        conversationMemory.addEntry("Akira", reply);
        await message.reply(reply);
        return;
      }

      conversationMemory.addEntry("Akira", inspected.reply);
      await message.reply(inspected.reply);
      return;
    }

    if (!originalMessage) {
      return;
    }

    const smartIntent = decideIntent(originalMessage, {
      hasActiveIdea: Boolean(activeIdea.idea)
    });

    const direct = isDirectStatusCommand(originalMessage);

    if (smartIntent.intent === "forget_idea") {
      await handleForgetIdea(message);
      return;
    }

    if (smartIntent.intent === "forget_all_memory") {
      await handleForgetAllMemory(message);
      return;
    }

    if (smartIntent.intent === "normalize_tasks") {
      const renamed = akira.normalizeBacklog();

      const reply = renamed.length === 0
        ? "Backlog already clean."
        : "Backlog normalized\n\n" + renamed.join("\n");

      conversationMemory.addEntry("Akira", reply);
      await message.reply(reply);
      return;
    }

    if (smartIntent.intent === "cleanup_backlog") {
      const archived = akira.cleanupBacklog();

      const reply = archived.length === 0
        ? "Backlog cleanup complete.\n\nNo stale fix tasks were archived."
        : "Backlog cleanup complete\n\nArchived tasks:\n" + archived.join("\n");

      conversationMemory.addEntry("Akira", reply);
      await message.reply(reply);
      return;
    }

    if (direct.ctoRun) {
      await handleCtoRun(message);
      return;
    }

    if (smartIntent.intent === "artifact") {
      await handleArtifactRequest(message, originalMessage);
      return;
    }

    if (smartIntent.intent === "research") {
      await handleResearch(message, originalMessage);
      return;
    }

    if (direct.projectState) {
      const reply = formatProjectState();
      conversationMemory.addEntry("Akira", reply);
      await message.reply(reply);
      return;
    }

    if (direct.devStatus) {
      const reply = formatDevStatus();
      conversationMemory.addEntry("Akira", reply);
      await message.reply(reply);
      return;
    }

    if (direct.reports) {
      const reply = formatWorkerReports();
      conversationMemory.addEntry("Akira", reply);
      await message.reply(reply);
      return;
    }

    if (direct.reviews) {
      const reply = formatReviews();
      conversationMemory.addEntry("Akira", reply);
      await message.reply(reply);
      return;
    }

    if (direct.buildFiles) {
      const reply = formatManifest();
      conversationMemory.addEntry("Akira", reply);
      await message.reply(reply);
      return;
    }

    if (direct.reviewLatest) {
      const reply = await reviewLatestWork();
      conversationMemory.addEntry("Akira", reply);
      await message.reply(reply);
      return;
    }

    if (await handleDirectTaskRun(message, originalMessage)) {
      return;
    }

    if (smartIntent.intent === "build_project" || isBuildConfirmation(originalMessage, state)) {
      const idea = state.draft_project_idea || activeIdea.idea || originalMessage;
      await handleBuildProject(message, idea);
      return;
    }

    if (smartIntent.intent === "brainstorm_project") {
      const mergedIdea = activeIdea.idea
        ? `${activeIdea.idea}\n${originalMessage}`
        : originalMessage;

      conversationMemory.setActiveIdea(mergedIdea);
      await handleBrainstorm(message, originalMessage);
      return;
    }

    if (refersToRecentImage(originalMessage)) {
      const latestImage = mediaMemory.getLatestImage();

      if (latestImage) {
        const inspected = await analyzeImageWithAkira(originalMessage, latestImage, state, activeIdea);

        if (!inspected.ok) {
          const reply = inspected.error || "I couldn't inspect the recent image.";
          conversationMemory.addEntry("Akira", reply);
          await message.reply(reply);
          return;
        }

        conversationMemory.addEntry("Akira", inspected.reply);
        await message.reply(inspected.reply);
        return;
      }
    }

    const recentContext = conversationMemory.getRecentContext(6);

    const response = await safeClaudeCall({
      max_tokens: 350,
      system: `
You are Akira.

Marshall's Chief of Staff.

You should feel like a normal chatbot first:
- natural
- conversational
- helpful
- practical
- warm

But you are also aware that you are part of Marshall's AI dev team.

Display names:
- Akira = Chief of Staff
- Kaneda = CTO
- Lucy = Research Worker
- Tetsuo = Backend Worker
- Rebecca = Frontend Worker
- Kiwi = QA Tester / Reviewer
- Kei = Architect

Current project state:
${JSON.stringify({
  project_name: state.project_name || "",
  milestone: state.milestone || "",
  current_focus: state.current_focus || "",
  next_action: state.next_action || "",
  open_tasks: Array.isArray(state.tasks) ? state.tasks.length : 0
}, null, 2)}

Current active idea:
${activeIdea.idea || "None"}

Recent conversation memory:
${recentContext || "None"}

Rules:
- Converse naturally like a normal chatbot
- Do not force build mode unless Marshall clearly asks
- Keep continuity with prior conversation when relevant
- You can help with apps, cars, troubleshooting, research, planning, or general questions
- If relevant, remember the active app idea naturally
- Do not pretend work is complete if it is not in state
`,
      messages: [
        {
          role: "user",
          content: originalMessage
        }
      ]
    });

    if (!response.ok) {
      await message.reply("Akira is thinking — try again in a few seconds.");
      return;
    }

    const reply = String(response.text || "Got it.").trim();
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
  } catch (err) {
    console.log("Akira error:", err);
    await message.reply("Akira hit an error.");
  }
});

client.initialize();

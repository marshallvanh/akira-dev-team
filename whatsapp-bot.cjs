const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");

const akira = require("./akira-core.cjs");
const conversationMemory = require("./conversation-memory.cjs");
const visionHelper = require("./vision-helper.cjs");
const { safeClaudeCall } = require("./safe-claude.cjs");
const { detectPresenceMode } = require("./presence-layer.cjs");
const researchWorker = require("./research-worker.cjs");
const artifactEngine = require("./artifact-engine.cjs");
const executionEngine = require("./execution-engine.cjs");

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "akira-chief-of-staff",
    dataPath: path.join(__dirname, ".wwebjs_auth"),
  }),
  puppeteer: {
    headless: true,
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--no-first-run",
      "--no-zygote",
      "--single-process",
      "--disable-extensions",
      "--disable-background-networking",
      "--disable-sync",
      "--metrics-recording-only",
      "--mute-audio"
    ],
  },
});

const WORKSPACE = path.join(__dirname, "workspace");
const MANIFEST_FILE = path.join(WORKSPACE, "build-manifest.json");

function normalized(text) {
  return String(text || "").trim().toLowerCase();
}

function shortText(text, max = 3500) {
  let value = String(text || "").trim();
  value = value.replace(/(\d+\.)\s/g, "\n$1 ");
  value = value.replace(/\. /g, ".\n");
  value = value.replace(/\n{3,}/g, "\n\n");
  value = value.trim();

  if (value.length <= max) return value;
  return value.slice(0, max - 3).trim() + "...";
}

function formatProjectState() {
  const state = akira.getState();
  const activeIdea = conversationMemory.getActiveIdea();
  const activeProject = executionEngine.getActiveProject();

  return [
    `Project: ${state.project_name || "Not started"}`,
    `Summary: ${state.project_summary || "None yet"}`,
    `Target user: ${state.target_user || "Not defined"}`,
    `Milestone: ${state.milestone || "Not set"}`,
    `Status: ${state.status || "idle"}`,
    `Current focus: ${state.current_focus || "None"}`,
    `Next action: ${state.next_action || "None"}`,
    `Active idea: ${activeIdea.idea || "None"}`,
    `Execution project: ${activeProject ? activeProject.name : "None"}`,
    `Open tasks: ${Array.isArray(state.tasks) ? state.tasks.length : 0}`,
    `Completed tasks: ${Array.isArray(state.completed_tasks) ? state.completed_tasks.length : 0}`,
    `Blocked tasks: ${Array.isArray(state.blocked_tasks) ? state.blocked_tasks.length : 0}`
  ].join("\n");
}

function formatDevStatus() {
  const state = akira.getState();
  const openTasks = Array.isArray(state.tasks) ? state.tasks : [];
  const completedTasks = Array.isArray(state.completed_tasks) ? state.completed_tasks : [];
  const blockedTasks = Array.isArray(state.blocked_tasks) ? state.blocked_tasks : [];

  let reply = "Dev Team Status\n\n";
  reply += `Open tasks: ${openTasks.length}\n`;
  reply += `Completed tasks: ${completedTasks.length}\n`;
  reply += `Blocked tasks: ${blockedTasks.length}\n`;

  if (openTasks.length > 0) {
    reply += `\nCurrent open:\n`;
    reply += openTasks.slice(0, 5).map((task) => `${task.id} — ${task.title}`).join("\n");
  }

  return reply.trim();
}

function formatBuildFiles() {
  if (!fs.existsSync(MANIFEST_FILE)) {
    return "No build files tracked yet.";
  }

  try {
    const manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
    if (!Array.isArray(manifest.files) || manifest.files.length === 0) {
      return "No build files tracked yet.";
    }

    return "Build Files\n\n" + manifest.files.slice(-20).map((file) => file.path).join("\n");
  } catch {
    return "Could not read build manifest.";
  }
}

function isDirectCommand(text) {
  const value = normalized(text);

  return {
    projectState: ["project state", "state", "akira state"].includes(value),
    devStatus: ["dev status", "akira dev status"].includes(value),
    buildFiles: ["build files", "what files have been built"].includes(value),
    activeProject: ["active project", "project plan", "current project"].includes(value),
    approveStage: ["approve", "approve stage", "continue project", "move to next stage"].includes(value),
    forgetIdea: [
      "forget this idea",
      "delete this idea",
      "clear active idea",
      "forget the idea",
      "remove active idea"
    ].includes(value),
    forgetEverything: [
      "forget everything",
      "clear all memory",
      "delete all memory",
      "wipe memory",
      "forget our conversation",
      "let's forget everything we had conversed about"
    ].includes(value)
  };
}

function looksLikeIdeaMessage(text) {
  const value = normalized(text);
  return [
    "i want to build",
    "i'm thinking of building",
    "im thinking of building",
    "let's build",
    "lets build",
    "app idea",
    "what about an app",
    "for tradies",
    "for sole traders",
    "for small business"
  ].some((phrase) => value.includes(phrase));
}

function looksLikeIdeaFollowup(text, hasIdea) {
  if (!hasIdea) return false;
  const value = normalized(text);

  return [
    "what about",
    "what if",
    "could it",
    "should it",
    "how would",
    "how could",
    "would it need",
    "what features",
    "what pages",
    "what screens",
    "what workflow",
    "for solo",
    "for teams",
    "for staff",
    "for customers"
  ].some((phrase) => value.includes(phrase));
}

function looksLikePointFollowup(text) {
  const value = normalized(text);
  return (
    /^expand\s+\d+/.test(value) ||
    /^point\s+\d+/.test(value) ||
    /^tell me more about\s+\d+/.test(value) ||
    /^explain\s+\d+/.test(value) ||
    /^compare\s+\d+\s+(and|vs)\s+\d+/.test(value) ||
    (value.includes("turn ") && value.includes(" into an mvp"))
  );
}

function looksLikeResearchCommand(text) {
  const value = normalized(text);
  return value.startsWith("research ") || value.startsWith("look up ") || value.startsWith("investigate ");
}

function looksLikeArtifactCommand(text) {
  const value = normalized(text);
  return (
    value.includes("flowchart") ||
    value.includes("flow chart") ||
    value.includes("workflow") ||
    value.includes("diagram") ||
    value.includes("roadmap") ||
    value.includes("wireframe") ||
    value.includes("architecture")
  );
}

function looksLikeExecutionCommand(text) {
  const value = normalized(text);
  return value.startsWith("build ") || value.startsWith("start project ");
}

function extractResearchQuery(text) {
  return String(text || "").trim().replace(/^research\s+/i, "").replace(/^look up\s+/i, "").replace(/^investigate\s+/i, "").trim();
}

function getStyleGuide(presenceMode, userMessage, hasActiveIdea) {
  const text = normalized(userMessage);
  const ideaMode =
    text.includes("feature") ||
    text.includes("what should it have") ||
    looksLikeIdeaMessage(text) ||
    looksLikeIdeaFollowup(text, hasActiveIdea) ||
    looksLikePointFollowup(text);

  if (ideaMode) {
    return `
Reply in POINT MODE.

Use this exact layout.

Quick take
One short sentence.

Key points
1. Short idea.
2. Short idea.
3. Short idea.
4. Short idea.
5. Short idea.

Best starting point
One short sentence.

You can ask
expand 1
expand 2
expand 3
compare 1 and 2
turn a point into MVP

Rules
• Each numbered point must be under 10 words
• One idea per line
• No explanations inside numbered points
• No paragraphs inside the list
• Use simple language
• Write for WhatsApp readability
• Be direct and concise
`;
  }

  if (presenceMode === "advisor") {
    return `
Reply in a scan-friendly structure.

Format:
Quick take:
1 sentence only.

Top points:
1. One short sentence.
2. One short sentence.
3. One short sentence.

Recommendation:
1 sentence only.

Follow-up options:
- Expand 1-3
- Compare points
- Ask for examples

Rules:
- Keep every point short
- No large paragraphs
- Easy to read on a phone
`;
  }

  return `
Reply naturally but neatly.
Use short paragraphs.
Keep it easy to scan in WhatsApp.
`;
}

async function handleImageQuestion(message, questionText) {
  const lastImage = visionHelper.getLastImage();

  if (!lastImage) {
    const reply = "I don’t currently have an image saved to inspect. Upload the photo again and I’ll take a look.";
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  const activeIdea = conversationMemory.getActiveIdea();
  const recentContext = conversationMemory.getRecentContext(6);

  const result = await visionHelper.analyzeImage(
    questionText || "Please describe what you can see in this image.",
    lastImage.path,
    lastImage.mimeType,
    recentContext,
    activeIdea.idea || ""
  );

  if (!result.ok) {
    const reply = result.error || "I couldn't analyze that image just now.";
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  conversationMemory.addEntry("Akira", result.reply);
  await message.reply(result.reply);
  return true;
}

async function handleResearch(message, originalMessage) {
  const query = extractResearchQuery(originalMessage);

  if (!query) {
    const reply = "Tell me what you want researched.";
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  await message.reply(`Got it — Lucy is investigating:\n${query}`);

  const result = await researchWorker.runResearch(query);

  if (!result.ok) {
    const reply = `Lucy couldn't complete that.\nReason: ${result.error || "Unknown error"}`;
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  const reply = shortText(String(result.research || "Research completed."), 4000);
  conversationMemory.addEntry("Akira", reply);
  await message.reply(reply);
  return true;
}

async function sendArtifactFiles(chatId, artifact) {
  if (!Array.isArray(artifact.absoluteFiles) || artifact.absoluteFiles.length === 0) return;

  for (const file of artifact.absoluteFiles) {
    if (!fs.existsSync(file)) continue;

    try {
      const media = MessageMedia.fromFilePath(file);
      await client.sendMessage(chatId, media, {
        sendMediaAsDocument: false,
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

  await message.reply("Got it — Kei is drawing that up.");

  const artifact = await artifactEngine.createArtifact(originalMessage, contextIdea);

  if (!artifact.ok) {
    const reply = artifact.error || "Akira couldn't create that artifact.";
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
    return true;
  }

  await sendArtifactFiles(message.from, artifact);

  const reply = `Done.\n\nType: ${artifact.type}\nDelivered: ${Array.isArray(artifact.files) ? artifact.files.join(", ") : "artifact sent"}`;
  conversationMemory.addEntry("Akira", reply);
  await message.reply(reply);
  return true;
}

async function handleExecutionRequest(message, originalMessage) {
  const project = executionEngine.createProject(originalMessage);
  const reply = executionEngine.formatCompactProject(project);
  conversationMemory.addEntry("Akira", reply);
  await message.reply(reply);
  return true;
}

async function handleApprovalRequest(message) {
  const result = executionEngine.approveCurrentStage();

  if (!result.ok) {
    await message.reply(result.error || "Could not approve current stage.");
    return true;
  }

  const lines = [];
  lines.push(`Approved: ${result.approvedStage.title}`);

  if (result.nextStage) {
    lines.push(`Next stage: ${result.nextStage.title}`);
    lines.push(`Owner: ${result.nextStage.owner}`);
    lines.push(`Deliverable: ${result.nextStage.deliverable}`);
  } else {
    lines.push("Project has no more stages.");
  }

  const reply = lines.join("\n");
  conversationMemory.addEntry("Akira", reply);
  await message.reply(reply);
  return true;
}

client.on("qr", (qr) => {
  console.log("QR RECEIVED");
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", () => {
  console.log("WhatsApp authenticated");
});

client.on("auth_failure", (msg) => {
  console.log("Auth failure:", msg);
});

client.on("ready", () => {
  console.log("Akira Dev Team Core is online");
});

client.on("disconnected", (reason) => {
  console.log("WhatsApp disconnected:", reason);
});

client.on("message", async (message) => {
  try {
    if (message.fromMe) return;

    const originalMessage = String(message.body || "").trim();

    if (message.hasMedia) {
      const capture = await visionHelper.captureIncomingImage(message);

      if (capture.ok) {
        conversationMemory.addEntry("Marshall", originalMessage || "[Image uploaded]");

        if (visionHelper.shouldAnalyzeImmediately(originalMessage)) {
          await handleImageQuestion(message, originalMessage);
          return;
        }

        const reply = "I’ve got the image. Ask me what you want checked, and I’ll inspect it.";
        conversationMemory.addEntry("Akira", reply);
        await message.reply(reply);
        return;
      }
    }

    if (!originalMessage) return;

    akira.saveMemory(originalMessage);
    conversationMemory.addEntry("Marshall", originalMessage);

    const direct = isDirectCommand(originalMessage);

    if (direct.forgetIdea) {
      const activeIdea = conversationMemory.getActiveIdea();

      if (!activeIdea.idea) {
        const reply = "Akira\nThere isn’t an active idea stored right now.";
        conversationMemory.addEntry("Akira", reply);
        await message.reply(reply);
        return;
      }

      conversationMemory.clearActiveIdea();
      const reply = `Akira\nDone — I forgot the active idea:\n${activeIdea.idea}`;
      conversationMemory.addEntry("Akira", reply);
      await message.reply(reply);
      return;
    }

    if (direct.forgetEverything) {
      conversationMemory.clearAllMemory();
      visionHelper.clearLastImage();
      await message.reply("Got it, fresh start! 👋\n\nWhat can I do for you?");
      return;
    }

    if (visionHelper.looksLikeImageQuestion(originalMessage)) {
      await handleImageQuestion(message, originalMessage);
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

    if (direct.buildFiles) {
      const reply = formatBuildFiles();
      conversationMemory.addEntry("Akira", reply);
      await message.reply(reply);
      return;
    }

    if (direct.activeProject) {
      const reply = executionEngine.formatProject(executionEngine.getActiveProject());
      conversationMemory.addEntry("Akira", reply);
      await message.reply(reply);
      return;
    }

    if (direct.approveStage) {
      await handleApprovalRequest(message);
      return;
    }

    if (looksLikeExecutionCommand(originalMessage)) {
      await handleExecutionRequest(message, originalMessage);
      return;
    }

    if (looksLikeResearchCommand(originalMessage)) {
      await handleResearch(message, originalMessage);
      return;
    }

    if (looksLikeArtifactCommand(originalMessage)) {
      await handleArtifactRequest(message, originalMessage);
      return;
    }

    const activeIdea = conversationMemory.getActiveIdea();
    const hasActiveIdea = Boolean(activeIdea.idea);
    const presence = detectPresenceMode(originalMessage, { hasActiveIdea });

    if (looksLikeIdeaMessage(originalMessage) || looksLikeIdeaFollowup(originalMessage, hasActiveIdea)) {
      const mergedIdea = activeIdea.idea ? `${activeIdea.idea}\n${originalMessage}` : originalMessage;
      conversationMemory.setActiveIdea(mergedIdea);
    }

    const recentContext = conversationMemory.getRecentContext(6);
    const state = akira.getState();
    const activeProject = executionEngine.getActiveProject();
    const styleGuide = getStyleGuide(presence.mode, originalMessage, hasActiveIdea);

    const response = await safeClaudeCall({
      max_tokens: presence.mode === "advisor" ? 420 : 320,
      system: `
You are Akira.
Marshall's Chief of Staff.

Your style:
- natural
- conversational
- practical
- warm
- clear

Current presence mode:
${presence.mode}

Current execution project:
${activeProject ? executionEngine.formatCompactProject(activeProject) : "None"}

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

Response style instructions:
${styleGuide}

Rules:
- Chat naturally like a smart human
- Keep continuity with prior conversation
- Help with apps, business ideas, cars, troubleshooting, planning, and daily questions
- Make replies easy to scan
- If there is an active execution project, stay aware of it
- Do not create tasks or pretend files were implemented unless explicitly done
`,
      messages: [{ role: "user", content: originalMessage }]
    });

    if (!response.ok) {
      await message.reply("Akira is thinking — try again in a few seconds.");
      return;
    }

    const reply = shortText(String(response.text || "Got it.").trim(), 4000);
    conversationMemory.addEntry("Akira", reply);
    await message.reply(reply);
  } catch (err) {
    console.log("Message handler error:", err);
    try {
      await message.reply("Akira hit an error.");
    } catch {}
  }
});

client.initialize();

process.on("uncaughtException", (err) => {
  console.log("Uncaught exception:", err);
});

process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection:", err);
});

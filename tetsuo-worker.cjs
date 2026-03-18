const Anthropic = require("@anthropic-ai/sdk");
const akira = require("./akira-core.cjs");
const manifest = require("./build-manifest.cjs");
const fs = require("fs");
const path = require("path");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-haiku-4-5";
const WORKSPACE = path.join(__dirname, "workspace");

if (!fs.existsSync(WORKSPACE)) {
  fs.mkdirSync(WORKSPACE, { recursive: true });
}

function cleanJson(text) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

async function runTask(task) {

  if (!task) {
    return { ok: false, error: "No task provided" };
  }

  akira.startTask(task.id);

  const state = akira.getState();

  const prompt = `
You are Tetsuo, lead engineer in an AI dev team.

Project:
${state.project_name}

Project summary:
${state.project_summary}

Current milestone:
${state.milestone}

Task:
${task.id}
Title: ${task.title}
Description: ${task.description}
Deliverable: ${task.deliverable}

Return ONLY valid JSON:

{
  "summary": "short summary",
  "implementation_notes": "engineering explanation",
  "files": [
    {
      "path": "relative/file/path.ext",
      "content": "full file content"
    }
  ],
  "next_step": "next engineering step",
  "blockers": "None or explanation"
}
`;

  try {

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1600,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const raw = cleanJson(response.content[0].text || "");

    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {

      parsed = {
        summary: "Task reviewed",
        implementation_notes: raw,
        files: [],
        next_step: "Review work",
        blockers: "None"
      };

    }

    const createdFiles = [];

    const files = Array.isArray(parsed.files) ? parsed.files : [];

    for (const file of files) {

      if (!file.path || typeof file.content !== "string") continue;

      const filePath = path.join(WORKSPACE, file.path);
      const dir = path.dirname(filePath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, file.content, "utf8");

      manifest.addFile(file.path);

      createdFiles.push(file.path);

    }

    const report = [
      `SUMMARY:\n${parsed.summary || "No summary"}`,
      `IMPLEMENTATION:\n${parsed.implementation_notes || "No notes"}`,
      `FILES:\n${createdFiles.length ? createdFiles.join("\n") : "No files created"}`,
      `NEXT STEP:\n${parsed.next_step || "None"}`,
      `BLOCKERS:\n${parsed.blockers || "None"}`
    ].join("\n\n");

    akira.addWorkerReport(task.id, report);
    akira.completeTask(task.id, report);

    return {
      ok: true,
      taskId: task.id,
      output: report,
      files: createdFiles
    };

  } catch (err) {

    akira.blockTask(task.id, err.message || "Worker execution failed");

    return {
      ok: false,
      taskId: task.id,
      error: err.message || "Worker execution failed"
    };

  }

}

async function runNextTask() {

  const task = akira.getNextPendingTask();

  if (!task) {
    return {
      ok: false,
      error: "No pending tasks"
    };
  }

  return await runTask(task);

}

module.exports = {
  runTask,
  runNextTask
};

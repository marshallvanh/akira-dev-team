const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-haiku-4-5";
const WORKSPACE = path.join(__dirname, "workspace");

function cleanJson(text) {
  return String(text || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function shortText(text, max = 220) {
  const value = String(text || "").replace(/\s+/g, " ").trim();
  if (!value) return "";
  if (value.length <= max) return value;
  return value.slice(0, max - 3).trim() + "...";
}

function extractSection(report, sectionName, nextSections = []) {
  const text = String(report || "");
  const escaped = sectionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const nextPattern = nextSections.length
    ? nextSections
        .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
        .join("|")
    : null;

  const regex = nextPattern
    ? new RegExp(`${escaped}:\\s*\\n([\\s\\S]*?)(\\n\\n(?:${nextPattern}):|\\n(?:${nextPattern}):|$)`, "i")
    : new RegExp(`${escaped}:\\s*\\n([\\s\\S]*)$`, "i");

  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function extractFilesList(report) {
  const filesSection = extractSection(report, "FILES", ["NEXT STEP", "BLOCKERS"]);
  if (!filesSection) return [];

  if (/^no files created$/i.test(filesSection.trim())) {
    return [];
  }

  return filesSection
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^no files created$/i.test(line));
}

function filesExist(filePaths) {
  return filePaths.map((filePath) => {
    const fullPath = path.join(WORKSPACE, filePath);
    return {
      path: filePath,
      exists: fs.existsSync(fullPath)
    };
  });
}

function taskLikelyNeedsArtifacts(task) {
  const text = `${task?.title || ""} ${task?.description || ""} ${task?.deliverable || ""}`.toLowerCase();

  const indicators = [
    "build",
    "create",
    "setup",
    "implement",
    "frontend",
    "backend",
    "api",
    "screen",
    "component",
    "components",
    "database",
    "schema",
    "ui",
    "infrastructure",
    "auth",
    "route",
    "model",
    "migration",
    "page",
    "files"
  ];

  return indicators.some((word) => text.includes(word));
}

function detectArtifactIssues(task, report) {
  const issues = [];
  const files = extractFilesList(report);
  const implementation = extractSection(report, "IMPLEMENTATION", ["FILES", "NEXT STEP", "BLOCKERS"]).toLowerCase();
  const filesSection = extractSection(report, "FILES", ["NEXT STEP", "BLOCKERS"]).toLowerCase();

  if (files.length === 0 && taskLikelyNeedsArtifacts(task)) {
    issues.push("Required deliverables appear missing because no files were recorded.");
  }

  if (implementation.includes('"path"') && files.length === 0) {
    issues.push("Report appears contradictory: implementation describes file output but no files were recorded.");
  }

  const checks = filesExist(files);
  const missingFiles = checks.filter((file) => !file.exists);

  if (missingFiles.length > 0) {
    issues.push(`Some reported files do not actually exist in workspace: ${missingFiles.slice(0, 3).map((f) => f.path).join(", ")}`);
  }

  if (filesSection.includes("no files created") && implementation.includes("created")) {
    issues.push("Report appears contradictory: says files were created but FILES section says none were created.");
  }

  return {
    issues,
    files,
    checks
  };
}

function fallbackReview(task, report) {
  const artifactCheck = detectArtifactIssues(task, report);

  if (artifactCheck.issues.length > 0) {
    return {
      decision: "revise",
      summary: "Core deliverables are still incomplete for this task.",
      issues: artifactCheck.issues.slice(0, 4).map((x) => shortText(x, 140)),
      next_action: `Resubmit ${task?.id || "the task"} with real, verifiable artifacts in workspace.`
    };
  }

  return {
    decision: "approve",
    summary: `QA check passed for ${task?.id || "task"}.`,
    issues: [],
    next_action: "Continue to the next task"
  };
}

async function reviewTask({ projectState, task, report }) {
  const artifactCheck = detectArtifactIssues(task, report);

  const prompt = `
You are QA Tester inside an AI dev team.

Your job is to verify whether completed work actually satisfies the task objective and deliverable.

Project:
${projectState?.project_name || "Untitled Project"}

Project summary:
${projectState?.project_summary || "No summary"}

Current milestone:
${projectState?.milestone || "Milestone 1"}

Task ID:
${task?.id || "Unknown"}

Task title:
${task?.title || "Unknown"}

Task description:
${task?.description || "No description"}

Expected deliverable:
${task?.deliverable || "No deliverable"}

Worker report:
${report || "No report provided"}

Artifact verification:
Reported files:
${artifactCheck.files.length > 0 ? artifactCheck.files.join("\n") : "None"}

File existence check:
${artifactCheck.checks.length > 0 ? artifactCheck.checks.map((f) => `${f.path}: ${f.exists ? "exists" : "missing"}`).join("\n") : "No files to verify"}

Pre-detected concerns:
${artifactCheck.issues.length > 0 ? artifactCheck.issues.map((x) => `- ${x}`).join("\n") : "None"}

Return ONLY valid JSON in this exact format:

{
  "decision": "approve | revise",
  "summary": "one short founder-friendly QA summary",
  "issues": ["issue 1", "issue 2", "issue 3"],
  "next_action": "one short next step"
}

Rules:
- Be practical, not perfectionist
- Approve if the task is reasonably complete for the current stage
- Revise if core deliverables are missing, contradictory, or not verifiable
- Keep summary short and readable
- Keep issues concise
- Do not invent files or evidence
- If expected artifacts are missing, revise
- Output JSON only
`;

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 700,
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    const raw = cleanJson(response.content?.[0]?.text || "");

    try {
      const parsed = JSON.parse(raw);

      const decision =
        String(parsed?.decision || "approve").toLowerCase() === "revise"
          ? "revise"
          : "approve";

      const issues = Array.isArray(parsed?.issues)
        ? parsed.issues.map((x) => shortText(x, 140)).filter(Boolean).slice(0, 4)
        : [];

      return {
        decision,
        summary: shortText(parsed?.summary || `QA check completed for ${task?.id || "task"}.`, 220),
        issues,
        next_action: shortText(parsed?.next_action || "Continue to the next task", 180)
      };
    } catch {
      return fallbackReview(task, report);
    }
  } catch {
    return fallbackReview(task, report);
  }
}

module.exports = {
  reviewTask
};

const Anthropic = require("@anthropic-ai/sdk");
const akira = require("./akira-core.cjs");
const fs = require("fs");
const path = require("path");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MODEL = "claude-haiku-4-5";
const WORKSPACE = path.join(__dirname, "workspace");
const ROOT_MANIFEST = path.join(WORKSPACE, "build-manifest.json");

if (!fs.existsSync(WORKSPACE)) {
  fs.mkdirSync(WORKSPACE, { recursive: true });
}

function cleanJson(text) {
  return String(text || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function slugifyProjectName(name) {
  return String(name || "untitled-project")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "untitled-project";
}

function getProjectWorkspace(state) {
  const slug = slugifyProjectName(state?.project_name || "untitled-project");
  const projectDir = path.join(WORKSPACE, slug);

  if (!fs.existsSync(projectDir)) {
    fs.mkdirSync(projectDir, { recursive: true });
  }

  return {
    slug,
    projectDir,
    manifestFile: path.join(projectDir, "build-manifest.json")
  };
}

function listProjectFiles(dir, prefix = "") {
  if (!fs.existsSync(dir)) return [];

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === "node_modules") continue;

    const full = path.join(dir, entry.name);
    const rel = prefix ? path.join(prefix, entry.name) : entry.name;

    if (entry.isDirectory()) {
      files.push(...listProjectFiles(full, rel));
    } else {
      files.push(rel);
    }
  }

  return files;
}

function readJsonFile(file, fallback) {
  try {
    if (!fs.existsSync(file)) return fallback;
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function writeJsonFile(file, data) {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

function safeResolve(baseDir, relativePath) {
  const cleanRelative = String(relativePath || "").replace(/^\/+/, "");
  const fullPath = path.resolve(baseDir, cleanRelative);
  const normalizedBase = path.resolve(baseDir);

  if (!fullPath.startsWith(normalizedBase)) {
    throw new Error(`Unsafe file path rejected: ${relativePath}`);
  }

  return fullPath;
}

function updateManifest(manifestFile, task, writtenFiles) {
  const manifest = readJsonFile(manifestFile, {
    project: "",
    updated_at: "",
    files: []
  });

  const existing = Array.isArray(manifest.files) ? manifest.files : [];

  for (const filePath of writtenFiles) {
    const already = existing.find((f) => f.path === filePath);

    if (already) {
      already.updated_at = new Date().toISOString();
      already.task_id = task.id;
    } else {
      existing.push({
        path: filePath,
        task_id: task.id,
        updated_at: new Date().toISOString()
      });
    }
  }

  manifest.updated_at = new Date().toISOString();
  manifest.files = existing;

  writeJsonFile(manifestFile, manifest);
}

function updateRootManifest(projectName, projectSlug, task, writtenFiles) {
  const manifest = readJsonFile(ROOT_MANIFEST, {
    updated_at: "",
    files: []
  });

  const existing = Array.isArray(manifest.files) ? manifest.files : [];

  for (const filePath of writtenFiles) {
    const fullDisplayPath = path.join(projectSlug, filePath);
    const already = existing.find((f) => f.path === fullDisplayPath);

    if (already) {
      already.updated_at = new Date().toISOString();
      already.task_id = task.id;
      already.project = projectName;
    } else {
      existing.push({
        path: fullDisplayPath,
        task_id: task.id,
        project: projectName,
        updated_at: new Date().toISOString()
      });
    }
  }

  manifest.updated_at = new Date().toISOString();
  manifest.files = existing;

  writeJsonFile(ROOT_MANIFEST, manifest);
}

function buildPlanningPrompt(state, task, existingFiles, projectSlug) {
  const visibleFiles =
    existingFiles.length > 0
      ? existingFiles.slice(0, 80).join("\n")
      : "No files exist yet.";

  return `
You are the Backend Worker in an AI dev team.

You are responsible for:
- APIs
- database schema and models
- authentication
- validation
- business logic
- integrations
- backend tests where relevant

Project name:
${state.project_name || "Untitled Project"}

Project summary:
${state.project_summary || "No summary"}

Target user:
${state.target_user || "Not specified"}

Current milestone:
${state.milestone || "Milestone 1"}

Task:
${task.id}
Title: ${task.title}
Description: ${task.description}
Deliverable: ${task.deliverable}

Project workspace folder:
workspace/${projectSlug}

Existing project files:
${visibleFiles}

Return ONLY valid JSON in this format:

{
  "objective": "one sentence objective",
  "files_to_create": ["path/one.ext", "path/two.ext"],
  "files_to_modify": ["path/three.ext"],
  "dependencies": ["dependency or none"],
  "risks": ["risk or none"],
  "approach": ["step 1", "step 2", "step 3"]
}

Rules:
- stay focused on backend work only
- be realistic and practical
- only list files that make sense for this task
- use relative file paths only
- if no existing files should be modified, return an empty array
- keep risks concise
- output JSON only
`;
}

function buildExecutionPrompt(state, task, projectSlug, plan) {
  return `
You are the Backend Worker in an AI dev team.

Execute the task using this approved internal build plan.

Project name:
${state.project_name || "Untitled Project"}

Project summary:
${state.project_summary || "No summary"}

Task:
${task.id}
Title: ${task.title}
Description: ${task.description}
Deliverable: ${task.deliverable}

Project workspace folder:
workspace/${projectSlug}

Execution plan:
${JSON.stringify(plan, null, 2)}

Return ONLY valid JSON in this format:

{
  "summary": "short summary of what you did",
  "implementation_notes": "clear explanation of the engineering work completed",
  "files": [
    {
      "path": "relative/path/to/file.ext",
      "content": "full file content"
    }
  ],
  "next_step": "what should happen next",
  "blockers": "None or short blocker note"
}

Rules:
- stay focused on backend work only
- create only the files that fit the task and plan
- file paths must be relative to the project workspace folder only
- do not use absolute paths
- prefer complete files over snippets
- do not claim files were created if they are not included in the files array
- if you cannot complete the task, be honest in blockers
- output JSON only
`;
}

function fallbackPlan(task) {
  return {
    objective: `Complete ${task?.id || "the task"} backend work.`,
    files_to_create: [],
    files_to_modify: [],
    dependencies: [],
    risks: ["Output may be incomplete if the task is underspecified."],
    approach: [
      "Review the task objective",
      "Create the required backend files",
      "Return the completed artifacts clearly"
    ]
  };
}

function shortList(items, max = 5) {
  if (!Array.isArray(items) || items.length === 0) return "None";
  return items.slice(0, max).join("\n");
}

function taskRequiresArtifacts(task, plan) {
  const taskText = `${task?.title || ""} ${task?.description || ""} ${task?.deliverable || ""}`.toLowerCase();

  const indicators = [
    "build",
    "create",
    "implement",
    "setup",
    "api",
    "backend",
    "database",
    "schema",
    "auth",
    "route",
    "model",
    "migration",
    "endpoint",
    "integration",
    "file",
    "service"
  ];

  const planCreates = Array.isArray(plan?.files_to_create) && plan.files_to_create.length > 0;
  const planModifies = Array.isArray(plan?.files_to_modify) && plan.files_to_modify.length > 0;
  const taskHints = indicators.some((word) => taskText.includes(word));

  return planCreates || planModifies || taskHints;
}

async function runTask(task) {
  if (!task) {
    return { ok: false, error: "No task provided" };
  }

  const state = akira.getState();
  const workspaceInfo = getProjectWorkspace(state);
  const existingFiles = listProjectFiles(workspaceInfo.projectDir);

  if (typeof akira.setFocus === "function") {
    akira.setFocus(`Backend: ${task.title}`);
  }

  if (typeof akira.setNextAction === "function") {
    akira.setNextAction(`Backend Worker is planning ${task.id}`);
  }

  let plan = fallbackPlan(task);

  try {
    const planningResponse = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1000,
      messages: [
        {
          role: "user",
          content: buildPlanningPrompt(state, task, existingFiles, workspaceInfo.slug)
        }
      ]
    });

    const planningRaw = cleanJson(planningResponse.content?.[0]?.text || "");

    try {
      const parsedPlan = JSON.parse(planningRaw);
      plan = {
        objective: parsedPlan?.objective || fallbackPlan(task).objective,
        files_to_create: Array.isArray(parsedPlan?.files_to_create) ? parsedPlan.files_to_create : [],
        files_to_modify: Array.isArray(parsedPlan?.files_to_modify) ? parsedPlan.files_to_modify : [],
        dependencies: Array.isArray(parsedPlan?.dependencies) ? parsedPlan.dependencies : [],
        risks: Array.isArray(parsedPlan?.risks) ? parsedPlan.risks : [],
        approach: Array.isArray(parsedPlan?.approach) ? parsedPlan.approach : fallbackPlan(task).approach
      };
    } catch {
      plan = fallbackPlan(task);
    }
  } catch {
    plan = fallbackPlan(task);
  }

  if (typeof akira.setNextAction === "function") {
    akira.setNextAction(`Backend Worker is building ${task.id}`);
  }

  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2200,
      messages: [
        {
          role: "user",
          content: buildExecutionPrompt(state, task, workspaceInfo.slug, plan)
        }
      ]
    });

    const raw = cleanJson(response.content?.[0]?.text || "");
    let parsed;

    try {
      parsed = JSON.parse(raw);
    } catch {
      parsed = {
        summary: "Backend task processed",
        implementation_notes: raw,
        files: [],
        next_step: "Review and continue",
        blockers: "None"
      };
    }

    const files = Array.isArray(parsed.files) ? parsed.files : [];
    const writtenFiles = [];

    for (const file of files) {
      if (!file || !file.path || typeof file.content !== "string") continue;

      const fullPath = safeResolve(workspaceInfo.projectDir, file.path);
      const dir = path.dirname(fullPath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(fullPath, file.content, "utf8");
      writtenFiles.push(file.path);
    }

    const artifactsRequired = taskRequiresArtifacts(task, plan);

    if (artifactsRequired && writtenFiles.length === 0) {
      const enforcementReport = [
        `[PLAN]`,
        `OBJECTIVE:\n${plan.objective || "No objective"}`,
        `FILES TO CREATE:\n${shortList(plan.files_to_create)}`,
        `FILES TO MODIFY:\n${shortList(plan.files_to_modify)}`,
        `DEPENDENCIES:\n${shortList(plan.dependencies)}`,
        `RISKS:\n${shortList(plan.risks)}`,
        `APPROACH:\n${shortList(plan.approach)}`,
        ``,
        `[EXECUTION]`,
        `SUMMARY:\nArtifact enforcement blocked completion`,
        `IMPLEMENTATION:\nTask appears to require real backend artifacts, but no files were returned by the worker.`,
        `FILES:\nNo files created`,
        `NEXT STEP:\nResubmit with actual backend files included in the files array.`,
        `BLOCKERS:\nArtifact enforcement: required files were not produced`
      ].join("\n\n");

      if (typeof akira.addWorkerReport === "function") {
        akira.addWorkerReport(task.id, `[Backend Worker]\n\n${enforcementReport}`, "Backend Worker");
      }

      if (typeof akira.blockTask === "function") {
        akira.blockTask(task.id, "Artifact enforcement: required files were not produced");
      }

      return {
        ok: false,
        taskId: task.id,
        error: "Artifact enforcement blocked completion: task required files but none were created."
      };
    }

    updateManifest(workspaceInfo.manifestFile, task, writtenFiles);
    updateRootManifest(state.project_name || "Untitled Project", workspaceInfo.slug, task, writtenFiles);

    const report = [
      `[PLAN]`,
      `OBJECTIVE:\n${plan.objective || "No objective"}`,
      `FILES TO CREATE:\n${shortList(plan.files_to_create)}`,
      `FILES TO MODIFY:\n${shortList(plan.files_to_modify)}`,
      `DEPENDENCIES:\n${shortList(plan.dependencies)}`,
      `RISKS:\n${shortList(plan.risks)}`,
      `APPROACH:\n${shortList(plan.approach)}`,
      ``,
      `[EXECUTION]`,
      `SUMMARY:\n${parsed.summary || "No summary"}`,
      `IMPLEMENTATION:\n${parsed.implementation_notes || "No implementation notes"}`,
      `FILES:\n${writtenFiles.length > 0 ? writtenFiles.join("\n") : "No files created"}`,
      `NEXT STEP:\n${parsed.next_step || "No next step"}`,
      `BLOCKERS:\n${parsed.blockers || "None"}`
    ].join("\n\n");

    if (typeof akira.addWorkerReport === "function") {
      akira.addWorkerReport(task.id, `[Backend Worker]\n\n${report}`, "Backend Worker");
    }

    if (typeof akira.completeTask === "function") {
      akira.completeTask(task.id, `[Backend Worker]\n\n${report}`);
    }

    return {
      ok: true,
      taskId: task.id,
      output: `[Backend Worker]\n\n${report}`,
      files: writtenFiles.map((file) => path.join(workspaceInfo.slug, file))
    };
  } catch (err) {
    const message = err.message || "Backend worker execution failed";

    if (typeof akira.addWorkerReport === "function") {
      akira.addWorkerReport(task.id, `[Backend Worker Error]\n${message}`, "Backend Worker");
    }

    return {
      ok: false,
      taskId: task.id,
      error: message
    };
  }
}

module.exports = {
  runTask
};

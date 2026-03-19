const fs = require("fs");
const path = require("path");

const WORKSPACE = path.join(__dirname, "workspace");
const EXECUTION_FILE = path.join(WORKSPACE, "execution-state.json");

function ensureWorkspace() {
  if (!fs.existsSync(WORKSPACE)) {
    fs.mkdirSync(WORKSPACE, { recursive: true });
  }
}

function defaultState() {
  return {
    activeProject: null,
    projects: []
  };
}

function loadState() {
  ensureWorkspace();

  if (!fs.existsSync(EXECUTION_FILE)) {
    const state = defaultState();
    fs.writeFileSync(EXECUTION_FILE, JSON.stringify(state, null, 2), "utf8");
    return state;
  }

  try {
    return JSON.parse(fs.readFileSync(EXECUTION_FILE, "utf8"));
  } catch {
    const state = defaultState();
    fs.writeFileSync(EXECUTION_FILE, JSON.stringify(state, null, 2), "utf8");
    return state;
  }
}

function saveState(state) {
  ensureWorkspace();
  fs.writeFileSync(EXECUTION_FILE, JSON.stringify(state, null, 2), "utf8");
}

function slugify(value) {
  return String(value || "project")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "project";
}

function buildStages(projectName, prompt) {
  const lower = String(prompt || "").toLowerCase();

  const common = [
    {
      id: "S1",
      title: "Requirements",
      owner: "Akira",
      status: "pending",
      deliverable: "Clear scope, target user, MVP boundary"
    },
    {
      id: "S2",
      title: "Research",
      owner: "Lucy",
      status: "pending",
      deliverable: "Competitors, APIs, risks, recommendations"
    },
    {
      id: "S3",
      title: "UX / Product Flow",
      owner: "Kei",
      status: "pending",
      deliverable: "Flowchart, wireframes, screen structure"
    },
    {
      id: "S4",
      title: "Architecture Plan",
      owner: "Akira",
      status: "pending",
      deliverable: "App structure, services, database, milestones"
    },
    {
      id: "S5",
      title: "Build Approval",
      owner: "Marshall",
      status: "waiting_approval",
      deliverable: "Founder approval to begin implementation"
    }
  ];

  if (lower.includes("fuel")) {
    common.splice(2, 0, {
      id: "S2B",
      title: "Data Source Validation",
      owner: "Lucy",
      status: "pending",
      deliverable: "Fuel price sources, coverage, update timing"
    });
  }

  if (lower.includes("tradie") || lower.includes("invoice") || lower.includes("jobs")) {
    common.splice(2, 0, {
      id: "S2B",
      title: "Workflow Validation",
      owner: "Lucy",
      status: "pending",
      deliverable: "Real-world tradie workflow and pain-point validation"
    });
  }

  return common;
}

function createProject(prompt) {
  const state = loadState();

  const cleanPrompt = String(prompt || "").trim();
  const name = cleanPrompt
    .replace(/^build\s+/i, "")
    .replace(/^start project\s+/i, "")
    .trim();

  const projectName = name || "New Project";
  const projectId = `P-${Date.now()}`;
  const slug = slugify(projectName);

  const project = {
    id: projectId,
    slug,
    name: projectName,
    prompt: cleanPrompt,
    status: "planning",
    createdAt: new Date().toISOString(),
    currentStage: "S1",
    awaitingApproval: false,
    stages: buildStages(projectName, cleanPrompt),
    notes: [],
    decisions: []
  };

  state.projects.push(project);
  state.activeProject = projectId;
  saveState(state);

  return project;
}

function getActiveProject() {
  const state = loadState();
  if (!state.activeProject) return null;
  return state.projects.find(p => p.id === state.activeProject) || null;
}

function setActiveProjectByName(name) {
  const state = loadState();
  const target = String(name || "").toLowerCase().trim();

  const found = state.projects.find(
    p => p.name.toLowerCase() === target || p.slug === target
  );

  if (!found) return null;

  state.activeProject = found.id;
  saveState(state);
  return found;
}

function approveCurrentStage() {
  const state = loadState();
  const project = state.projects.find(p => p.id === state.activeProject);

  if (!project) {
    return { ok: false, error: "No active project." };
  }

  const current = project.stages.find(s => s.id === project.currentStage);

  if (!current) {
    return { ok: false, error: "No current stage found." };
  }

  current.status = "approved";

  const idx = project.stages.findIndex(s => s.id === current.id);
  const next = project.stages[idx + 1];

  if (next) {
    next.status = next.status === "waiting_approval" ? "waiting_approval" : "ready";
    project.currentStage = next.id;
    project.awaitingApproval = next.status === "waiting_approval";
  } else {
    project.currentStage = null;
    project.status = "approved";
    project.awaitingApproval = false;
  }

  saveState(state);
  return { ok: true, project, approvedStage: current, nextStage: next || null };
}

function addProjectNote(note) {
  const state = loadState();
  const project = state.projects.find(p => p.id === state.activeProject);

  if (!project) {
    return { ok: false, error: "No active project." };
  }

  project.notes.push({
    note: String(note || "").trim(),
    at: new Date().toISOString()
  });

  saveState(state);
  return { ok: true, project };
}

function formatProject(project) {
  if (!project) return "No active project.";

  const lines = [];
  lines.push(`Project: ${project.name}`);
  lines.push(`Status: ${project.status}`);
  lines.push(`Current stage: ${project.currentStage || "None"}`);
  lines.push("");

  lines.push("Stages");
  for (const stage of project.stages) {
    lines.push(`${stage.id} — ${stage.title}`);
    lines.push(`Owner: ${stage.owner}`);
    lines.push(`Status: ${stage.status}`);
    lines.push(`Deliverable: ${stage.deliverable}`);
    lines.push("");
  }

  if (project.notes.length > 0) {
    lines.push("Recent notes");
    for (const note of project.notes.slice(-5)) {
      lines.push(`- ${note.note}`);
    }
  }

  return lines.join("\n").trim();
}

function formatCompactProject(project) {
  if (!project) return "No active project.";

  const current = project.stages.find(s => s.id === project.currentStage);

  return [
    `Project started: ${project.name}`,
    `Status: ${project.status}`,
    `Current stage: ${current ? current.title : "None"}`,
    `Owner: ${current ? current.owner : "None"}`,
    "",
    "Next stages:",
    ...project.stages.slice(0, 5).map(s => `${s.id} — ${s.title} (${s.owner})`)
  ].join("\n");
}

module.exports = {
  createProject,
  getActiveProject,
  setActiveProjectByName,
  approveCurrentStage,
  addProjectNote,
  formatProject,
  formatCompactProject
};

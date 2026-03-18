const fs = require("fs");
const path = require("path");

const STATE_FILE = path.join(__dirname, "project-state.json");

function nowIso() {
  return new Date().toISOString();
}

function defaultState() {
  return {
    project_name: "",
    project_summary: "",
    target_user: "",
    milestone: "Milestone 1",
    status: "idle",
    current_focus: "",
    next_action: "",
    assigned_to: "Tetsuo",
    draft_project_idea: "",
    memory: [],
    tasks: [],
    completed_tasks: [],
    blocked_tasks: [],
    worker_reports: [],
    reviews: [],
    task_counter: 1,
    updated_at: nowIso()
  };
}

function ensureStateFile() {
  if (!fs.existsSync(STATE_FILE)) {
    fs.writeFileSync(STATE_FILE, JSON.stringify(defaultState(), null, 2), "utf8");
    return;
  }

  try {
    const raw = fs.readFileSync(STATE_FILE, "utf8").trim();
    if (!raw) {
      fs.writeFileSync(STATE_FILE, JSON.stringify(defaultState(), null, 2), "utf8");
      return;
    }
    JSON.parse(raw);
  } catch {
    fs.writeFileSync(STATE_FILE, JSON.stringify(defaultState(), null, 2), "utf8");
  }
}

function normalizeTask(task) {
  return {
    id: String(task?.id || ""),
    title: String(task?.title || "Untitled task"),
    description: String(task?.description || ""),
    deliverable: String(task?.deliverable || ""),
    assigned: String(task?.assigned || "Tetsuo"),
    status: String(task?.status || "pending"),
    result: String(task?.result || ""),
    parent_task_id: String(task?.parent_task_id || task?.revision_of || ""),
    block_reason: String(task?.block_reason || task?.reason || ""),
    archived_reason: String(task?.archived_reason || ""),
    created_at: String(task?.created_at || nowIso()),
    updated_at: String(task?.updated_at || nowIso())
  };
}

function normalizeReview(review) {
  return {
    task_id: String(review?.task_id || ""),
    decision: String(review?.decision || "approve"),
    summary: String(review?.summary || ""),
    issues: Array.isArray(review?.issues) ? review.issues.map(String) : [],
    next_action: String(review?.next_action || "Continue to the next task"),
    created_at: String(review?.created_at || nowIso())
  };
}

function normalizeReport(report) {
  return {
    id: String(report?.id || `WR-${Date.now()}`),
    task_id: String(report?.task_id || ""),
    worker: String(report?.worker || "Worker"),
    report: String(report?.report || ""),
    created_at: String(report?.created_at || nowIso())
  };
}

function normalizeMemory(memory) {
  if (!Array.isArray(memory)) return [];
  return memory.map((entry) => ({
    text: String(entry?.text || entry || ""),
    timestamp: String(entry?.timestamp || nowIso())
  }));
}

function normalizeState(state) {
  const base = defaultState();

  return {
    ...base,
    ...state,
    project_name: String(state?.project_name || base.project_name),
    project_summary: String(state?.project_summary || base.project_summary),
    target_user: String(state?.target_user || base.target_user),
    milestone: String(state?.milestone || base.milestone),
    status: String(state?.status || base.status),
    current_focus: String(state?.current_focus || state?.focus || base.current_focus),
    next_action: String(state?.next_action || base.next_action),
    assigned_to: String(state?.assigned_to || base.assigned_to),
    draft_project_idea: String(state?.draft_project_idea || base.draft_project_idea),
    memory: normalizeMemory(state?.memory),
    tasks: Array.isArray(state?.tasks) ? state.tasks.map(normalizeTask) : [],
    completed_tasks: Array.isArray(state?.completed_tasks) ? state.completed_tasks.map(normalizeTask) : [],
    blocked_tasks: Array.isArray(state?.blocked_tasks) ? state.blocked_tasks.map(normalizeTask) : [],
    worker_reports: Array.isArray(state?.worker_reports) ? state.worker_reports.map(normalizeReport) : [],
    reviews: Array.isArray(state?.reviews) ? state.reviews.map(normalizeReview) : [],
    task_counter: typeof state?.task_counter === "number" && state.task_counter > 0 ? state.task_counter : 1,
    updated_at: String(state?.updated_at || nowIso())
  };
}

function readState() {
  ensureStateFile();
  const raw = fs.readFileSync(STATE_FILE, "utf8");
  return normalizeState(JSON.parse(raw));
}

function writeState(state) {
  const normalized = normalizeState(state);
  normalized.updated_at = nowIso();
  fs.writeFileSync(STATE_FILE, JSON.stringify(normalized, null, 2), "utf8");
  return normalized;
}

function getState() {
  return readState();
}

function saveMemory(entry) {
  const state = readState();
  state.memory.push({
    text: String(entry || ""),
    timestamp: nowIso()
  });

  if (state.memory.length > 100) {
    state.memory = state.memory.slice(-100);
  }

  return writeState(state);
}

function setFocus(text) {
  const state = readState();
  state.current_focus = String(text || "");
  return writeState(state);
}

function setNextAction(text) {
  const state = readState();
  state.next_action = String(text || "");
  return writeState(state);
}

function setDraftProjectIdea(text) {
  const state = readState();
  state.draft_project_idea = String(text || "");
  return writeState(state);
}

function startProject(project) {
  const state = readState();
  state.project_name = String(project?.project_name || project?.name || "Untitled Project");
  state.project_summary = String(project?.project_summary || "");
  state.target_user = String(project?.target_user || "");
  state.milestone = String(project?.milestone || "Milestone 1");
  state.status = "active";
  state.current_focus = "Project planning";
  state.next_action = "Review the first development tasks";
  state.assigned_to = "Tetsuo";
  state.draft_project_idea = "";
  return writeState(state);
}

function createTask(input) {
  const state = readState();
  const id = "T" + state.task_counter++;

  const task = normalizeTask({
    id,
    title: typeof input === "string" ? input : input?.title || "Untitled task",
    description: typeof input === "string" ? "" : input?.description || "",
    deliverable: typeof input === "string" ? "" : input?.deliverable || "",
    assigned: typeof input === "string" ? "Tetsuo" : input?.assigned || "Tetsuo",
    status: "pending",
    result: "",
    parent_task_id: typeof input === "string" ? "" : input?.parent_task_id || "",
    created_at: nowIso(),
    updated_at: nowIso()
  });

  state.tasks.push(task);
  state.status = "active";
  state.current_focus = task.title;
  state.next_action = `${task.assigned} to begin ${task.id}`;

  writeState(state);
  return task;
}

function getTaskById(taskId) {
  const state = readState();
  const target = String(taskId || "").toLowerCase();

  return (
    state.tasks.find((t) => String(t.id).toLowerCase() === target) ||
    state.completed_tasks.find((t) => String(t.id).toLowerCase() === target) ||
    state.blocked_tasks.find((t) => String(t.id).toLowerCase() === target) ||
    null
  );
}

function getNextPendingTask() {
  const state = readState();
  return state.tasks.find((task) => String(task.status).toLowerCase() === "pending") || null;
}

function startTask(taskId) {
  const state = readState();
  const target = String(taskId || "").toLowerCase();
  const task = state.tasks.find((t) => String(t.id).toLowerCase() === target);

  if (!task) return null;

  task.status = "running";
  task.updated_at = nowIso();
  state.current_focus = task.title;
  state.next_action = `Wait for ${task.assigned} to finish ${task.id}`;

  writeState(state);
  return task;
}

function completeTask(taskId, result = "") {
  const state = readState();
  const target = String(taskId || "").toLowerCase();
  const index = state.tasks.findIndex((t) => String(t.id).toLowerCase() === target);

  if (index === -1) return null;

  const task = state.tasks[index];
  task.status = "done";
  task.result = String(result || "");
  task.updated_at = nowIso();

  state.tasks.splice(index, 1);
  state.completed_tasks.push(task);

  state.current_focus = state.tasks[0]?.title || "";
  state.next_action = state.tasks[0]
    ? `${state.tasks[0].assigned || "Worker"} to begin ${state.tasks[0].id}`
    : "Review progress and create the next task";

  writeState(state);
  return task;
}

function blockTask(taskId, reason = "") {
  const state = readState();
  const target = String(taskId || "").toLowerCase();
  const index = state.tasks.findIndex((t) => String(t.id).toLowerCase() === target);

  if (index === -1) return null;

  const task = state.tasks[index];
  task.status = "blocked";
  task.block_reason = String(reason || "Blocked");
  task.updated_at = nowIso();

  state.tasks.splice(index, 1);
  state.blocked_tasks.push(task);
  state.next_action = "Review blocked task";

  writeState(state);
  return task;
}

function addWorkerReport(taskId, reportText, worker = "Worker") {
  const state = readState();

  state.worker_reports.push(
    normalizeReport({
      id: `WR-${Date.now()}`,
      task_id: String(taskId || ""),
      worker,
      report: String(reportText || ""),
      created_at: nowIso()
    })
  );

  return writeState(state);
}

function getWorkerReports() {
  return readState().worker_reports;
}

function addReview(taskId, review) {
  const state = readState();

  state.reviews.push(
    normalizeReview({
      task_id: String(taskId || ""),
      decision: review?.decision || "approve",
      summary: review?.summary || "",
      issues: Array.isArray(review?.issues) ? review.issues : [],
      next_action: review?.next_action || "Continue to the next task",
      created_at: nowIso()
    })
  );

  return writeState(state);
}

function getReviews() {
  return readState().reviews;
}

function createRevisionTask(taskOrTaskId, review) {
  const originalTask =
    typeof taskOrTaskId === "string" ? getTaskById(taskOrTaskId) : taskOrTaskId;

  if (!originalTask) return null;

  const issuesText =
    Array.isArray(review?.issues) && review.issues.length > 0
      ? review.issues.map((x) => `- ${x}`).join("\n")
      : "- Review requested changes";

  return createTask({
    title: `Fix ${originalTask.id}`,
    description:
      `Resolve QA issues from ${originalTask.id}.\n\n` +
      `Review summary: ${review?.summary || "Revision requested"}\n\n` +
      `Required changes:\n${issuesText}`,
    deliverable:
      review?.next_action || `Updated implementation that resolves the review feedback for ${originalTask.id}`,
    assigned: originalTask.assigned || "Tetsuo",
    parent_task_id: originalTask.id
  });
}

function normalizeFixTitle(title) {
  const value = String(title || "").trim();
  if (!value) return value;

  const match = value.match(/T\d+/i);
  if (match) {
    return `Fix ${match[0].toUpperCase()}`;
  }

  return value;
}

function normalizeBacklog() {
  const state = readState();
  const renamed = [];

  const fixList = (list) => {
    if (!Array.isArray(list)) return [];

    return list.map((task) => {
      const normalizedTask = normalizeTask(task);
      const oldTitle = normalizedTask.title;
      const lower = oldTitle.toLowerCase();

      if (lower.startsWith("revise ") || lower.startsWith("fix ")) {
        const newTitle = normalizeFixTitle(oldTitle);

        if (newTitle && newTitle !== oldTitle) {
          normalizedTask.title = newTitle;
          renamed.push(`${normalizedTask.id}: "${oldTitle}" → "${newTitle}"`);
        }
      }

      return normalizedTask;
    });
  };

  state.tasks = fixList(state.tasks);
  state.completed_tasks = fixList(state.completed_tasks);
  state.blocked_tasks = fixList(state.blocked_tasks);

  writeState(state);
  return renamed;
}

function extractBaseTaskId(task) {
  const titleMatch = String(task?.title || "").match(/T\d+/i);
  const parentId = String(task?.parent_task_id || "").match(/T\d+/i);

  if (parentId) return parentId[0].toUpperCase();
  if (titleMatch) return titleMatch[0].toUpperCase();
  return null;
}

function taskNumericId(task) {
  return parseInt(String(task?.id || "").replace(/\D/g, ""), 10) || 0;
}

function cleanupBacklog() {
  const state = readState();
  const tasks = Array.isArray(state.tasks) ? state.tasks.map(normalizeTask) : [];
  const archived = [];
  const keep = [];
  const latestFixByBase = new Map();

  for (const task of tasks) {
    const lower = String(task.title || "").toLowerCase();
    const isFixLike = lower.startsWith("fix ") || lower.startsWith("revise ");
    const baseId = extractBaseTaskId(task);

    if (!isFixLike || !baseId) {
      keep.push(task);
      continue;
    }

    const existing = latestFixByBase.get(baseId);

    if (!existing) {
      latestFixByBase.set(baseId, task);
      continue;
    }

    if (taskNumericId(task) > taskNumericId(existing)) {
      archived.push({
        ...existing,
        status: "done",
        archived_reason: `Archived by backlog cleanup in favor of newer fix task ${task.id}`,
        result: existing.result || "Archived by backlog cleanup"
      });
      latestFixByBase.set(baseId, task);
    } else {
      archived.push({
        ...task,
        status: "done",
        archived_reason: `Archived by backlog cleanup in favor of newer fix task ${existing.id}`,
        result: task.result || "Archived by backlog cleanup"
      });
    }
  }

  for (const keptFix of latestFixByBase.values()) {
    keep.push(keptFix);
  }

  keep.sort((a, b) => taskNumericId(a) - taskNumericId(b));

  state.tasks = keep;
  state.completed_tasks = [
    ...state.completed_tasks,
    ...archived.map(normalizeTask)
  ];

  writeState(state);

  return archived.map(
    (task) => `${task.id}: archived stale fix task for ${extractBaseTaskId(task) || "unknown base task"}`
  );
}

module.exports = {
  getState,
  saveMemory,
  setFocus,
  setNextAction,
  setDraftProjectIdea,
  startProject,
  createTask,
  getTaskById,
  getNextPendingTask,
  startTask,
  completeTask,
  blockTask,
  addWorkerReport,
  getWorkerReports,
  addReview,
  getReviews,
  createRevisionTask,
  normalizeBacklog,
  cleanupBacklog
};

const akira = require("./akira-core.cjs");

function normalized(text) {
  return String(text || "").toLowerCase();
}

function chooseWorker(task) {
  const text = normalized(`${task?.title || ""} ${task?.description || ""} ${task?.deliverable || ""}`);

  const researchSignals = [
    "research",
    "investigate",
    "compare",
    "competitor",
    "competitors",
    "api options",
    "best option",
    "feasibility",
    "legal",
    "licensing"
  ];

  const qaSignals = [
    "test",
    "testing",
    "qa",
    "quality assurance",
    "bug",
    "bugs",
    "verify",
    "validation pass",
    "integration testing",
    "end-to-end",
    "end to end"
  ];

  const frontendSignals = [
    "frontend",
    "ui",
    "user interface",
    "screen",
    "screens",
    "component",
    "components",
    "responsive",
    "layout",
    "form",
    "forms",
    "dashboard",
    "client-side",
    "client side",
    "page",
    "pages",
    "styling",
    "design"
  ];

  const backendSignals = [
    "backend",
    "api",
    "apis",
    "database",
    "schema",
    "model",
    "models",
    "auth",
    "authentication",
    "jwt",
    "oauth",
    "endpoint",
    "endpoints",
    "validation",
    "business logic",
    "integration",
    "integrations",
    "server",
    "migration",
    "postgres",
    "supabase"
  ];

  const researchScore = researchSignals.filter((term) => text.includes(term)).length;
  const qaScore = qaSignals.filter((term) => text.includes(term)).length;
  const frontendScore = frontendSignals.filter((term) => text.includes(term)).length;
  const backendScore = backendSignals.filter((term) => text.includes(term)).length;

  if (researchScore > 0) return "Research Worker";
  if (qaScore > 0 && qaScore >= frontendScore && qaScore >= backendScore) return "QA Tester";
  if (frontendScore > backendScore && frontendScore > 0) return "Frontend Worker";
  if (backendScore > 0) return "Backend Worker";

  return "Tetsuo";
}

function sortTasksForExecution(tasks) {
  const safeTasks = Array.isArray(tasks) ? tasks.slice() : [];

  const scoreTask = (task) => {
    const title = normalized(task?.title || "");
    const description = normalized(task?.description || "");
    const combined = `${title} ${description}`;

    let score = 0;

    if (task?.parent_task_id || task?.revision_of) score += 100;
    if (title.startsWith("fix ")) score += 90;
    if (title.startsWith("revise ")) score += 80;
    if (combined.includes("resolve qa")) score += 70;
    if (combined.includes("qa issues")) score += 60;
    if (combined.includes("review feedback")) score += 50;

    return score;
  };

  return safeTasks.sort((a, b) => {
    const scoreDiff = scoreTask(b) - scoreTask(a);
    if (scoreDiff !== 0) return scoreDiff;

    const aNum = parseInt(String(a?.id || "").replace(/\D/g, ""), 10) || 0;
    const bNum = parseInt(String(b?.id || "").replace(/\D/g, ""), 10) || 0;

    return aNum - bNum;
  });
}

function getNextExecutionStep() {
  const state = akira.getState();
  const allTasks = Array.isArray(state.tasks) ? state.tasks : [];
  const pendingTasks = allTasks.filter((task) => String(task.status || "").toLowerCase() === "pending");
  const sorted = sortTasksForExecution(pendingTasks);
  const pending = sorted[0];

  if (!pending) {
    return {
      action: "idle",
      message: "No pending tasks. Waiting for Founder instructions."
    };
  }

  const worker = chooseWorker(pending);

  return {
    action: "execute",
    task: pending,
    worker,
    summary: `Next task is ${pending.id} — ${pending.title}`,
    reason: pending.parent_task_id || pending.revision_of
      ? `Revision priority: ${worker} should resolve the fix task before new work`
      : `Best worker match: ${worker}`
  };
}

module.exports = {
  getNextExecutionStep,
  chooseWorker,
  sortTasksForExecution
};

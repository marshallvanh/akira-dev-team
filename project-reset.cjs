const akira = require("./akira-core.cjs");

function detectResetIntent(messageText) {
  const text = String(messageText || "").trim().toLowerCase();

  if (!text) return null;

  const patterns = [
    { type: "delete_project", test: /^(delete project|remove project|erase project)$/i },
    { type: "reset_project", test: /^(reset project|restart project|start over)$/i },
    { type: "clear_tasks", test: /^(clear tasks|delete tasks|remove tasks)$/i },
    { type: "full_reset", test: /^(reset all|wipe project|wipe everything|clear everything)$/i }
  ];

  for (const item of patterns) {
    if (item.test.test(text)) {
      return item.type;
    }
  }

  return null;
}

function resetProjectState(intentType) {
  const state = akira.getState();

  if (intentType === "clear_tasks") {
    const removedCount = state.tasks.length;

    state.tasks = [];
    state.current_focus = "";
    state.next_action = state.project_name
      ? "Create or queue the next task"
      : "No active project";

    akira.saveState(state);

    return {
      ok: true,
      action: "clear_tasks",
      message: `All tasks cleared (${removedCount} removed).`,
      state: akira.getState()
    };
  }

  if (intentType === "delete_project") {
    if (!state.project_name) {
      return {
        ok: true,
        action: "delete_project",
        message: "There is no active project to delete.",
        state
      };
    }

    const deletedName = state.project_name;
    akira.resetProjectData();

    return {
      ok: true,
      action: "delete_project",
      message: `Project "${deletedName}" deleted.`,
      state: akira.getState()
    };
  }

  if (intentType === "reset_project") {
    if (!state.project_name) {
      return {
        ok: true,
        action: "reset_project",
        message: "There is no active project to reset.",
        state
      };
    }

    const projectName = state.project_name;
    const summary = state.project_summary;
    const targetUser = state.target_user;
    const milestone = state.milestone;
    const draftIdea = state.draft_project_idea;

    akira.resetProjectData();

    const clean = akira.getState();
    clean.project_name = projectName;
    clean.project_summary = summary;
    clean.target_user = targetUser;
    clean.milestone = milestone || "Milestone 1";
    clean.status = "active";
    clean.current_focus = "Project reset complete";
    clean.next_action = "Create the first fresh task";
    clean.assigned_to = "Tetsuo";
    clean.draft_project_idea = draftIdea || "";

    akira.saveState(clean);

    return {
      ok: true,
      action: "reset_project",
      message: `Project "${projectName}" reset. Tasks, completed work, blockers, reports, and reviews were cleared.`,
      state: akira.getState()
    };
  }

  if (intentType === "full_reset") {
    akira.resetProjectData();

    return {
      ok: true,
      action: "full_reset",
      message: "Everything was cleared. Workspace reset complete.",
      state: akira.getState()
    };
  }

  return {
    ok: false,
    action: "none",
    message: "No reset action matched.",
    state
  };
}

module.exports = {
  detectResetIntent,
  resetProjectState
};

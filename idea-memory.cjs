const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "idea-memory.json");

function nowIso() {
  return new Date().toISOString();
}

function defaultMemory() {
  return {
    active_idea: "",
    active_idea_summary: "",
    history: [],
    updated_at: nowIso()
  };
}

function ensureFile() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify(defaultMemory(), null, 2), "utf8");
    return;
  }

  try {
    const raw = fs.readFileSync(FILE, "utf8").trim();
    if (!raw) {
      fs.writeFileSync(FILE, JSON.stringify(defaultMemory(), null, 2), "utf8");
      return;
    }
    JSON.parse(raw);
  } catch {
    fs.writeFileSync(FILE, JSON.stringify(defaultMemory(), null, 2), "utf8");
  }
}

function readMemory() {
  ensureFile();
  const parsed = JSON.parse(fs.readFileSync(FILE, "utf8"));

  return {
    active_idea: String(parsed?.active_idea || ""),
    active_idea_summary: String(parsed?.active_idea_summary || ""),
    history: Array.isArray(parsed?.history) ? parsed.history : [],
    updated_at: String(parsed?.updated_at || nowIso())
  };
}

function writeMemory(data) {
  const payload = {
    active_idea: String(data?.active_idea || ""),
    active_idea_summary: String(data?.active_idea_summary || ""),
    history: Array.isArray(data?.history) ? data.history : [],
    updated_at: nowIso()
  };

  fs.writeFileSync(FILE, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}

function getActiveIdea() {
  const memory = readMemory();
  return {
    idea: memory.active_idea,
    summary: memory.active_idea_summary
  };
}

function setActiveIdea(idea, summary = "") {
  const memory = readMemory();
  const cleanIdea = String(idea || "").trim();
  const cleanSummary = String(summary || "").trim();

  if (!cleanIdea) {
    return writeMemory(memory);
  }

  memory.active_idea = cleanIdea;
  memory.active_idea_summary = cleanSummary;

  memory.history.push({
    idea: cleanIdea,
    summary: cleanSummary,
    timestamp: nowIso()
  });

  if (memory.history.length > 50) {
    memory.history = memory.history.slice(-50);
  }

  return writeMemory(memory);
}

function clearActiveIdea() {
  const memory = readMemory();
  memory.active_idea = "";
  memory.active_idea_summary = "";
  return writeMemory(memory);
}

function hasActiveIdea() {
  const memory = readMemory();
  return Boolean(String(memory.active_idea || "").trim());
}

module.exports = {
  getActiveIdea,
  setActiveIdea,
  clearActiveIdea,
  hasActiveIdea
};

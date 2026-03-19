const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const WORKSPACE = path.join(__dirname, "workspace", "artifacts");

function ensureWorkspace() {
  if (!fs.existsSync(WORKSPACE)) {
    fs.mkdirSync(WORKSPACE, { recursive: true });
  }
}

function cleanInput(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[^a-z0-9,\s]/g, "")
    .trim();
}

/* =========================
   FLOWCHART (PHASE 1)
========================= */

function extractSteps(text) {
  const cleaned = cleanInput(text);

  const parts = cleaned
    .split(/with|and|,/)
    .map(s => s.trim())
    .filter(Boolean);

  const mapped = parts.map(p => {
    if (p.includes("login")) return "User Login";
    if (p.includes("map")) return "View Map";
    if (p.includes("alert")) return "Set Alerts";
    if (p.includes("notification")) return "Notifications";
    if (p.includes("job")) return "Manage Jobs";
    if (p.includes("invoice")) return "Create Invoice";
    if (p.includes("payment")) return "Process Payment";
    return p.charAt(0).toUpperCase() + p.slice(1);
  });

  return [...new Set(mapped)];
}

function buildFlow(steps) {
  let diagram = "flowchart TD\n";

  steps.forEach((step, i) => {
    const id = String.fromCharCode(65 + i);
    diagram += `${id}[${step}]\n`;

    if (i > 0) {
      const prev = String.fromCharCode(65 + i - 1);
      diagram += `${prev} --> ${id}\n`;
    }
  });

  return diagram;
}

/* =========================
   WIREFRAME (PHASE 2)
========================= */

function extractUIBlocks(text) {
  const cleaned = cleanInput(text);

  const blocks = [];

  if (cleaned.includes("dashboard")) {
    blocks.push("Header");
    blocks.push("Stats Cards");
    blocks.push("Recent Activity");
    blocks.push("Quick Actions");
  }

  if (cleaned.includes("calorie")) {
    blocks.push("Header");
    blocks.push("Daily Calories");
    blocks.push("Food Log");
    blocks.push("Add Food Button");
  }

  if (cleaned.includes("tradie")) {
    blocks.push("Header");
    blocks.push("Jobs List");
    blocks.push("Add Job Button");
    blocks.push("Invoices");
  }

  if (blocks.length === 0) {
    blocks.push("Header");
    blocks.push("Main Content");
    blocks.push("Actions");
  }

  return blocks;
}

function buildWireframe(blocks) {
  let diagram = "flowchart TD\n";

  blocks.forEach((block, i) => {
    const id = `B${i}`;
    diagram += `${id}["${block}"]\n`;

    if (i > 0) {
      const prev = `B${i - 1}`;
      diagram += `${prev} --> ${id}\n`;
    }
  });

  return diagram;
}

/* =========================
   MAIN ENGINE
========================= */

async function createArtifact(prompt = "", contextIdea = "") {
  try {
    ensureWorkspace();

    const timestamp = Date.now();
    const baseName = `artifact-${timestamp}`;

    const inputFile = path.join(WORKSPACE, `${baseName}.mmd`);
    const outputFile = path.join(WORKSPACE, `${baseName}.png`);
    const configFile = path.join(WORKSPACE, `${baseName}.json`);

    let diagram;
    let type;

    const combined = (prompt + " " + contextIdea).toLowerCase();

    if (combined.includes("wireframe") || combined.includes("ui")) {
      const blocks = extractUIBlocks(combined);
      diagram = buildWireframe(blocks);
      type = "wireframe";
    } else {
      const steps = extractSteps(combined);
      diagram = buildFlow(steps);
      type = "smart-flowchart";
    }

    fs.writeFileSync(inputFile, diagram);

    fs.writeFileSync(
      configFile,
      JSON.stringify({
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || "/usr/bin/chromium",
        args: ["--no-sandbox"]
      })
    );

    execSync(
      `npx mmdc -i "${inputFile}" -o "${outputFile}" -p "${configFile}"`,
      { stdio: "pipe" }
    );

    return {
      ok: true,
      type,
      files: [path.basename(outputFile)],
      absoluteFiles: [outputFile]
    };

  } catch (err) {
    return {
      ok: false,
      error: err.message
    };
  }
}

module.exports = {
  createArtifact
};

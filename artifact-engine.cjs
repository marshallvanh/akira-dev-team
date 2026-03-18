const Anthropic = require("@anthropic-ai/sdk");
const fs = require("fs");
const path = require("path");

let puppeteer = null;

try {
  puppeteer = require("puppeteer");
} catch {
  try {
    puppeteer = require("puppeteer-core");
  } catch {
    puppeteer = null;
  }
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const MODEL = "claude-haiku-4-5";
const WORKSPACE = path.join(__dirname, "workspace");
const ARTIFACTS_DIR = path.join(WORKSPACE, "artifacts");

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function cleanJson(text) {
  return String(text || "")
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

function slugify(text) {
  return String(text || "artifact")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "artifact";
}

function detectArtifactType(message) {
  const text = String(message || "").toLowerCase();

  if (text.includes("flowchart") || text.includes("flow chart")) return "flowchart";
  if (text.includes("workflow")) return "workflow";
  if (text.includes("roadmap")) return "roadmap";
  if (text.includes("wireframe")) return "wireframe";
  if (text.includes("graph")) return "graph";
  if (text.includes("diagram")) return "diagram";

  return "artifact";
}

function systemPromptForType(type) {
  if (["flowchart", "workflow", "roadmap", "graph", "diagram"].includes(type)) {
    return `
You create Mermaid diagrams.

Return ONLY valid JSON:
{
  "title": "short title",
  "summary": "short founder-friendly explanation",
  "filename": "short-file-name",
  "content": "valid Mermaid only"
}

Rules:
- content must be valid Mermaid
- do not wrap in markdown fences
- keep labels readable
- keep it useful for a founder
- default to flowchart TD unless another Mermaid format clearly fits better
`;
  }

  if (type === "wireframe") {
    return `
You create simple text wireframes.

Return ONLY valid JSON:
{
  "title": "short title",
  "summary": "short founder-friendly explanation",
  "filename": "short-file-name",
  "content": "markdown wireframe"
}

Rules:
- plain markdown
- practical and easy to understand
`;
  }

  return `
Return ONLY valid JSON:
{
  "title": "short title",
  "summary": "short founder-friendly explanation",
  "filename": "short-file-name",
  "content": "artifact content"
}
`;
}

async function renderMermaidToPng(baseName, mermaidContent, title) {
  if (!puppeteer) {
    return {
      ok: false,
      error: "Puppeteer is not installed, so PNG rendering is unavailable."
    };
  }

  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage"
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: 1800,
      height: 1400,
      deviceScaleFactor: 2
    });

    await page.setContent(`
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:32px;background:white;">
        <div id="app"></div>
        <script type="module">
          import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';
          mermaid.initialize({ startOnLoad: false, securityLevel: 'loose' });
          const result = await mermaid.render('diagram-svg', ${JSON.stringify(String(mermaidContent || "").trim())});
          document.getElementById('app').innerHTML = result.svg;
        </script>
      </body>
      </html>
    `, { waitUntil: "networkidle0" });

    await page.waitForSelector("svg", { timeout: 15000 });

    const app = await page.$("#app");
    if (!app) {
      throw new Error("Rendered diagram container not found.");
    }

    const pngPath = path.join(ARTIFACTS_DIR, `${baseName}.png`);
    await app.screenshot({
      path: pngPath,
      omitBackground: false
    });

    await browser.close();

    return {
      ok: true,
      pngPath
    };
  } catch (err) {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }

    return {
      ok: false,
      error: err.message || "PNG rendering failed."
    };
  }
}

async function createArtifact(userRequest, activeIdea = "") {
  ensureDir(WORKSPACE);
  ensureDir(ARTIFACTS_DIR);

  const type = detectArtifactType(userRequest);

  const prompt = `
User request:
${userRequest}

Current active idea:
${activeIdea || "None"}

Create the requested artifact.
`;

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1400,
    system: systemPromptForType(type),
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  const raw = cleanJson(response.content?.[0]?.text || "");
  let parsed;

  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {
      title: "Artifact",
      summary: "Artifact created.",
      filename: "artifact",
      content: raw
    };
  }

  const baseName = slugify(parsed.filename || parsed.title || type);

  if (["flowchart", "workflow", "roadmap", "graph", "diagram"].includes(type)) {
    const rendered = await renderMermaidToPng(
      baseName,
      String(parsed.content || "").trim(),
      parsed.title || "Diagram"
    );

    if (!rendered.ok) {
      return {
        ok: false,
        error: rendered.error || "PNG rendering failed."
      };
    }

    return {
      ok: true,
      type,
      title: String(parsed.title || "Artifact"),
      summary: String(parsed.summary || "Artifact created."),
      relativePath: path.relative(__dirname, rendered.pngPath),
      files: [path.relative(__dirname, rendered.pngPath)],
      absoluteFiles: [rendered.pngPath],
      content: String(parsed.content || "")
    };
  }

  const mdPath = path.join(ARTIFACTS_DIR, `${baseName}.md`);
  fs.writeFileSync(mdPath, String(parsed.content || "").trim() + "\n", "utf8");

  return {
    ok: true,
    type,
    title: String(parsed.title || "Artifact"),
    summary: String(parsed.summary || "Artifact created."),
    relativePath: path.relative(__dirname, mdPath),
    files: [path.relative(__dirname, mdPath)],
    absoluteFiles: [mdPath],
    content: String(parsed.content || "")
  };
}

module.exports = {
  createArtifact,
  detectArtifactType
};

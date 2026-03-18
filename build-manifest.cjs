const fs = require("fs");
const path = require("path");

const WORKSPACE = path.join(__dirname, "workspace");
const MANIFEST_FILE = path.join(WORKSPACE, "build-manifest.json");

function ensureWorkspace() {
  if (!fs.existsSync(WORKSPACE)) {
    fs.mkdirSync(WORKSPACE, { recursive: true });
  }
}

function ensureManifest() {
  ensureWorkspace();

  if (!fs.existsSync(MANIFEST_FILE)) {
    fs.writeFileSync(
      MANIFEST_FILE,
      JSON.stringify({ files: [] }, null, 2),
      "utf8"
    );
  }
}

function readManifest() {
  ensureManifest();

  try {
    return JSON.parse(fs.readFileSync(MANIFEST_FILE, "utf8"));
  } catch {
    return { files: [] };
  }
}

function writeManifest(data) {
  ensureWorkspace();
  fs.writeFileSync(MANIFEST_FILE, JSON.stringify(data, null, 2), "utf8");
}

function addFile(filePath) {
  const manifest = readManifest();

  if (!manifest.files.find((f) => f.path === filePath)) {
    manifest.files.push({ path: filePath });
    writeManifest(manifest);
  }
}

function getFiles() {
  const manifest = readManifest();
  return manifest.files || [];
}

module.exports = {
  addFile,
  getFiles
};

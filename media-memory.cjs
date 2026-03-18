const fs = require("fs");
const path = require("path");

const FILE = path.join(__dirname, "media-memory.json");
const MEDIA_DIR = path.join(__dirname, "workspace", "incoming-media");

function nowIso() {
  return new Date().toISOString();
}

function defaultState() {
  return {
    latest_image: null,
    updated_at: nowIso()
  };
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function ensureFile() {
  ensureDir(MEDIA_DIR);

  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify(defaultState(), null, 2), "utf8");
    return;
  }

  try {
    const raw = fs.readFileSync(FILE, "utf8").trim();
    if (!raw) {
      fs.writeFileSync(FILE, JSON.stringify(defaultState(), null, 2), "utf8");
      return;
    }
    JSON.parse(raw);
  } catch {
    fs.writeFileSync(FILE, JSON.stringify(defaultState(), null, 2), "utf8");
  }
}

function readState() {
  ensureFile();
  const parsed = JSON.parse(fs.readFileSync(FILE, "utf8"));

  return {
    latest_image: parsed?.latest_image || null,
    updated_at: String(parsed?.updated_at || nowIso())
  };
}

function writeState(data) {
  const payload = {
    latest_image: data?.latest_image || null,
    updated_at: nowIso()
  };

  fs.writeFileSync(FILE, JSON.stringify(payload, null, 2), "utf8");
  return payload;
}

function extensionFromMime(mimeType) {
  const mime = String(mimeType || "").toLowerCase();

  if (mime.includes("jpeg") || mime.includes("jpg")) return ".jpg";
  if (mime.includes("png")) return ".png";
  if (mime.includes("webp")) return ".webp";
  if (mime.includes("gif")) return ".gif";

  return ".bin";
}

function saveLatestImage(media) {
  ensureDir(MEDIA_DIR);

  const ext = extensionFromMime(media?.mimetype);
  const filename = `image-${Date.now()}${ext}`;
  const absolutePath = path.join(MEDIA_DIR, filename);

  fs.writeFileSync(absolutePath, Buffer.from(media.data, "base64"));

  const state = readState();
  state.latest_image = {
    path: absolutePath,
    mimetype: String(media?.mimetype || "application/octet-stream"),
    saved_at: nowIso()
  };

  writeState(state);

  return state.latest_image;
}

function getLatestImage() {
  const state = readState();
  const image = state.latest_image;

  if (!image || !image.path) {
    return null;
  }

  if (!fs.existsSync(image.path)) {
    return null;
  }

  return image;
}

function clearLatestImage() {
  const state = readState();
  state.latest_image = null;
  writeState(state);
}

module.exports = {
  saveLatestImage,
  getLatestImage,
  clearLatestImage
};

let lastImage = null;

function getLastImage() {
  return lastImage;
}

function clearLastImage() {
  lastImage = null;
}

async function captureIncomingImage(message) {
  try {
    const media = await message.downloadMedia();

    if (!media) {
      return { ok: false };
    }

    const fs = require("fs");
    const path = require("path");

    const imagesDir = path.join(__dirname, "workspace", "images");

    if (!fs.existsSync(imagesDir)) {
      fs.mkdirSync(imagesDir, { recursive: true });
    }

    const filename = `image_${Date.now()}.jpg`;
    const filepath = path.join(imagesDir, filename);

    fs.writeFileSync(filepath, Buffer.from(media.data, "base64"));

    lastImage = {
      path: filepath,
      mimeType: media.mimetype
    };

    return { ok: true };
  } catch (err) {
    console.log("image capture error:", err);
    return { ok: false };
  }
}

function shouldAnalyzeImmediately(text) {
  const t = String(text || "").toLowerCase();

  return (
    t.includes("what is this") ||
    t.includes("what do you see") ||
    t.includes("what's this") ||
    t.includes("identify this")
  );
}

function looksLikeImageQuestion(text) {
  const t = String(text || "").toLowerCase();

  return (
    t.includes("image") ||
    t.includes("photo") ||
    t.includes("picture") ||
    t.includes("what is this")
  );
}

async function analyzeImage(question, path) {
  return {
    ok: true,
    reply:
      "I can see the image you uploaded. Image analysis is enabled, but the advanced vision model isn't connected yet. We can add that later."
  };
}

module.exports = {
  captureIncomingImage,
  getLastImage,
  clearLastImage,
  shouldAnalyzeImmediately,
  looksLikeImageQuestion,
  analyzeImage
};

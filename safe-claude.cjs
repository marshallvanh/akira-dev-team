require("dotenv").config();

const Anthropic = require("@anthropic-ai/sdk");

const apiKey = process.env.ANTHROPIC_API_KEY;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function safeClaudeCall(options, retries = 3) {
  if (!apiKey) {
    return {
      ok: false,
      error: "Missing ANTHROPIC_API_KEY"
    };
  }

  const anthropic = new Anthropic({ apiKey });

  for (let i = 0; i < retries; i++) {
    try {
      const response = await anthropic.messages.create({
        model: "claude-haiku-4-5",
        ...options
      });

      return {
        ok: true,
        text: response.content?.[0]?.text || ""
      };
    } catch (err) {
      const message = err?.message || "";

      if (message.includes("rate_limit") || message.includes("429")) {
        if (i < retries - 1) {
          const wait = 2000 * (i + 1);
          console.log(`Rate limit hit — retrying in ${wait}ms`);
          await sleep(wait);
          continue;
        }

        return {
          ok: false,
          error: "Rate limit reached. Try again in a moment."
        };
      }

      console.log("Claude call error:", message);

      return {
        ok: false,
        error: message || "Claude request failed."
      };
    }
  }

  return {
    ok: false,
    error: "Claude request failed."
  };
}

module.exports = {
  safeClaudeCall
};

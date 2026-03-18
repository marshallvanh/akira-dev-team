const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const MODEL = "claude-haiku-4-5";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function safeClaudeCall(options, retries = 3) {

  for (let i = 0; i < retries; i++) {

    try {

      const response = await anthropic.messages.create({
        model: MODEL,
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

      return {
        ok: false,
        error: message
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

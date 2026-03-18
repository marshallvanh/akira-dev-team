const axios = require("axios");

const PERPLEXITY_API_KEY = process.env.PERPLEXITY_API_KEY;

function cleanText(text) {
  return String(text || "").trim();
}

async function runResearch(query) {
  if (!PERPLEXITY_API_KEY) {
    return {
      ok: false,
      error: "PERPLEXITY_API_KEY not set"
    };
  }

  try {
    const response = await axios.post(
      "https://api.perplexity.ai/chat/completions",
      {
        model: "sonar-pro",
        messages: [
          {
            role: "system",
            content: `
You are Research Worker inside an AI dev team.

Your job is to produce a CLEAN, FOUNDER-FRIENDLY research brief.

IMPORTANT:
- Do NOT write like a giant report
- Do NOT use markdown tables
- Do NOT dump too much detail
- Keep it concise, clear, and practical
- Prefer short sections and bullet points
- Focus on what matters for product and engineering decisions

Always respond in this exact style:

Research Worker

Topic: <topic>

Quick take:
<2-4 sentence summary in plain English>

Best options:
- <option 1> — <why it matters>
- <option 2> — <why it matters>
- <option 3> — <why it matters>

Recommended for MVP:
<one strong recommendation with reason>

Watch-outs:
- <risk or limitation>
- <risk or limitation>

Build advice:
- <practical advice for implementation>
- <practical advice for implementation>

Founder decision:
<say either "No decision needed right now" or ask for one simple decision>

Rules:
- Keep the whole response readable in WhatsApp
- No giant walls of text
- No long comparisons
- No raw citations cluttering the message
- Be practical, not academic
`
          },
          {
            role: "user",
            content: query
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${PERPLEXITY_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const text = cleanText(response.data?.choices?.[0]?.message?.content || "No result");

    return {
      ok: true,
      research: text
    };
  } catch (err) {
    return {
      ok: false,
      error: err.message || "Research request failed"
    };
  }
}

module.exports = {
  runResearch
};

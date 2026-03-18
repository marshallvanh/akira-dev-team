const Anthropic = require("@anthropic-ai/sdk");

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const MODEL = "claude-haiku-4-5";

async function askAgent(role, prompt) {
  const systems = {
    akira: `
You are Akira.
Chief of Staff.

Your role:
- keep the conversation natural
- synthesize the team's thinking
- avoid sounding robotic
- do not create tasks yet
- do not force build mode
- guide the founder clearly
`,

    lucy: `
You are Lucy.
Research specialist.

Focus on:
- competitors
- market gap
- APIs
- risks
- realistic product opportunities

Be concise and practical.
`,

    kei: `
You are Kei.
Architect.

Focus on:
- structure
- workflows
- product logic
- system shape
- implementation direction

Be clear and practical.
`,

    kaneda: `
You are Kaneda.
CTO.

Focus on:
- MVP strategy
- sequencing
- scope control
- what to build first
- what to leave for later

Be concise and startup-minded.
`
  };

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 260,
    system: systems[role],
    messages: [
      {
        role: "user",
        content: prompt
      }
    ]
  });

  return String(response.content?.[0]?.text || "").trim();
}

async function brainstorm(message, activeIdea = "") {
  const basePrompt = `
Founder message:
${message}

Current active idea:
${activeIdea || "None"}
`;

  const lucy = await askAgent("lucy", basePrompt);
  const kei = await askAgent("kei", `${basePrompt}\n\nLucy says:\n${lucy}`);
  const kaneda = await askAgent("kaneda", `${basePrompt}\n\nLucy says:\n${lucy}\n\nKei says:\n${kei}`);

  const akira = await askAgent(
    "akira",
    `
Founder message:
${message}

Current active idea:
${activeIdea || "None"}

Lucy says:
${lucy}

Kei says:
${kei}

Kaneda says:
${kaneda}

Respond naturally to the founder.
Structure:
- start with Akira's natural response
- then add a short "Team take" section
- then a short "Best next step" section
Do not sound repetitive.
`
  );

  return {
    ok: true,
    akira,
    lucy,
    kei,
    kaneda,
    combined: [
      `Akira`,
      akira,
      ``,
      `Team take`,
      `Lucy: ${lucy}`,
      `Kei: ${kei}`,
      `Kaneda: ${kaneda}`
    ].join("\n")
  };
}

module.exports = {
  brainstorm
};

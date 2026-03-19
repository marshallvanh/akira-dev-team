function normalized(text) {
  return String(text || "").trim().toLowerCase();
}

function includesAny(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase));
}

function equalsAny(text, phrases) {
  return phrases.includes(text);
}

function detectPresenceMode(message, options = {}) {
  const text = normalized(message);
  const hasActiveIdea = Boolean(options.hasActiveIdea);

  if (!text) {
    return { mode: "ignore", reason: "empty" };
  }

  if (
    equalsAny(text, [
      "project state",
      "state",
      "akira state",
      "dev status",
      "akira dev status",
      "reports",
      "worker reports",
      "reviews",
      "review reports",
      "build files",
      "what files have been built",
      "review latest",
      "review the latest work",
      "cto run",
      "cto",
      "cto next",
      "normalize tasks",
      "cleanup backlog"
    ])
  ) {
    return { mode: "operator", reason: "direct_command" };
  }

  if (
    equalsAny(text, [
      "forget this idea",
      "delete this idea",
      "clear active idea",
      "forget the idea",
      "remove active idea",
      "forget everything",
      "clear all memory",
      "delete all memory",
      "wipe memory",
      "forget our conversation"
    ])
  ) {
    return { mode: "operator", reason: "memory_command" };
  }

  if (text.startsWith("run task ")) {
    return { mode: "operator", reason: "run_task" };
  }

  if (
    text.startsWith("research ") ||
    text.startsWith("look up ") ||
    text.startsWith("investigate ") ||
    text.startsWith("researcher ")
  ) {
    return { mode: "operator", reason: "research" };
  }

  if (
    includesAny(text, [
      "flowchart",
      "flow chart",
      "workflow",
      "roadmap",
      "wireframe",
      "diagram",
      "graph"
    ])
  ) {
    return { mode: "operator", reason: "artifact" };
  }

  if (
    equalsAny(text, [
      "ok build it",
      "okay build it",
      "build it",
      "lets build it",
      "let's build it",
      "turn that into a project",
      "turn it into a project",
      "go ahead and build it",
      "yes build it",
      "start the project",
      "create the project",
      "start development",
      "continue development",
      "keep building",
      "continue building",
      "run next task"
    ])
  ) {
    return { mode: "operator", reason: "explicit_action" };
  }

  if (
    includesAny(text, [
      "compare",
      "pros and cons",
      "what would be better",
      "best option",
      "which is better",
      "what should i choose",
      "how should this work",
      "what should it do",
      "what features should it have",
      "can you create a plan",
      "can you map this out",
      "can you structure this",
      "can you break this down"
    ])
  ) {
    return { mode: "advisor", reason: "structured_guidance" };
  }

  if (
    includesAny(text, [
      "i want to build",
      "i'm thinking of building",
      "im thinking of building",
      "let's build",
      "lets build",
      "app idea",
      "what about an app",
      "could this app",
      "for tradies",
      "for sole traders",
      "for small business"
    ])
  ) {
    return { mode: "advisor", reason: "idea_shaping" };
  }

  if (
    hasActiveIdea &&
    includesAny(text, [
      "what about",
      "what if",
      "could it",
      "should it",
      "how would",
      "how could",
      "would it need",
      "what features",
      "what pages",
      "what screens",
      "what workflow",
      "for solo",
      "for teams",
      "for staff",
      "for customers"
    ])
  ) {
    return { mode: "advisor", reason: "idea_followup" };
  }

  return { mode: "chat", reason: "default_chat" };
}

module.exports = {
  detectPresenceMode
};

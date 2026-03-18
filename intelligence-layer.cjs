function normalized(text) {
  return String(text || "").trim().toLowerCase();
}

function includesAny(text, phrases) {
  return phrases.some((phrase) => text.includes(phrase));
}

function startsWithAny(text, phrases) {
  return phrases.some((phrase) => text.startsWith(phrase));
}

function decideIntent(message, options = {}) {
  const text = normalized(message);
  const hasActiveIdea = Boolean(options.hasActiveIdea);

  if (!text) {
    return { intent: "ignore" };
  }

  if (
    [
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
      "cto next"
    ].includes(text)
  ) {
    return { intent: "direct_command" };
  }

  if (
    [
      "forget this idea",
      "delete this idea",
      "clear active idea",
      "forget the idea",
      "remove active idea"
    ].includes(text)
  ) {
    return { intent: "forget_idea" };
  }

  if (
    [
      "forget everything",
      "clear all memory",
      "delete all memory",
      "wipe memory",
      "forget our conversation"
    ].includes(text)
  ) {
    return { intent: "forget_all_memory" };
  }

  if (text === "normalize tasks") {
    return { intent: "normalize_tasks" };
  }

  if (text === "cleanup backlog") {
    return { intent: "cleanup_backlog" };
  }

  if (text.startsWith("run task ")) {
    return { intent: "run_specific_task" };
  }

  if (
    startsWithAny(text, ["research ", "look up ", "investigate ", "researcher "])
  ) {
    return { intent: "research" };
  }

  if (
    includesAny(text, [
      "flowchart",
      "flow chart",
      "workflow",
      "roadmap",
      "wireframe",
      "graph",
      "diagram"
    ])
  ) {
    return { intent: "artifact" };
  }

  if (
    [
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
      "create the project"
    ].includes(text)
  ) {
    return { intent: "build_project" };
  }

  if (
    includesAny(text, [
      "start development",
      "continue development",
      "keep building",
      "continue building",
      "run next task"
    ])
  ) {
    return { intent: "start_development" };
  }

  if (
    includesAny(text, [
      "i want to build",
      "i'm thinking of building",
      "im thinking of building",
      "let's build",
      "lets build",
      "what about an app",
      "app idea",
      "could this app",
      "how could this work",
      "how would this work",
      "how would it work",
      "what should it do",
      "what features",
      "should it have",
      "could it also",
      "what if it",
      "for tradies",
      "for sole traders",
      "for small business"
    ])
  ) {
    return { intent: "brainstorm_project" };
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
      "can it",
      "can you explain",
      "can you map",
      "would it need",
      "would it work",
      "for solo",
      "for teams",
      "for staff",
      "for customers",
      "how should",
      "what features",
      "what pages",
      "what screens",
      "what workflow"
    ])
  ) {
    return { intent: "brainstorm_project" };
  }

  if (
    includesAny(text, [
      "my car",
      "bmw",
      "ranger",
      "ute",
      "dog",
      "oil leak",
      "coolant leak",
      "engine",
      "mechanic",
      "invoice",
      "pricing",
      "weather",
      "job",
      "resume",
      "email"
    ])
  ) {
    return { intent: "general_chat" };
  }

  return { intent: "general_chat" };
}

module.exports = {
  decideIntent
};


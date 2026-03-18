function formatReview(review, taskId, revisionTaskId) {

return `
Latest review for ${taskId}

Decision: ${review.decision}

Summary:
${review.summary}

Issues:
${review.issues.map(i => `• ${i}`).join("\n")}

Next Action:
${review.next_action}

${review.decision === "revise" ? `

Revision Task

Task ID: ${revisionTaskId}
Fixes Task: ${taskId}
Worker: Backend Worker

Required Fixes:
${review.issues.map(i => `• ${i}`).join("\n")}
` : ""}
`;
}

module.exports = {
formatReview
};

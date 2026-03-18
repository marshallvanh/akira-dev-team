function summarizeExecution(result, review) {
  const status = review?.decision?.toLowerCase() === "approve"
    ? "Completed"
    : review?.decision?.toLowerCase() === "revise"
    ? "Needs Revision"
    : "In Progress";

  let reply = `${result.workerLabel} finished ${result.taskId}\n\n`;

  reply += `Status: ${status}\n`;

  if (review?.issues && review.issues.length > 0) {
    reply += `Issue:\n- ${review.issues.join("\n- ")}\n`;
  }

  if (review?.next_action) {
    reply += `Next Step:\n${review.next_action}\n`;
  }

  reply += `\nFounder Action: None needed right now`;

  return reply;
}

module.exports = { summarizeExecution };

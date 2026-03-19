const { execSync } = require("child_process");
const path = require("path");

const REPO_DIR = path.join(__dirname);

function run(cmd) {
  try {
    return execSync(cmd, {
      cwd: REPO_DIR,
      stdio: "pipe"
    }).toString();
  } catch (err) {
    return err.message;
  }
}

function commitTask({ taskId, worker, files = [] }) {

  try {

    run("git add .");

    const message = `${taskId} – ${worker} completed task`;

    run(`git commit -m "${message}"`);

    run("git push");

    return {
      ok: true,
      message: "Task committed to GitHub"
    };

  } catch (err) {

    return {
      ok: false,
      error: err.message
    };

  }

}

module.exports = {
  commitTask
};

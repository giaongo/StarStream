import { spawn } from "node:child_process";
import fs from "node:fs";

/**
 * CLear temp files and folders
 * @param {*} filePath
 * @param {*} folderPath
 */
const clearTemp = (folderPath, filePath) => {
  try {
    // Remove folder from local storage
    if (fs.existsSync(folderPath)) {
      fs.rm(folderPath, { recursive: true, force: true }, (err) => {
        if (err) {
          throw new Error("Error deleting folder ", err);
        }
      });
    }
  } catch (error) {
    console.error("Error clearing temp files: ", error);
  }
};

/**
 * Execute linux shell command
 * @param {*} command
 * @returns
 */
const runShellCommand = (command, cb) => {
  const runCommand = spawn(command, { shell: true });
  runCommand.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
  });

  runCommand.on("close", async (code) => {
    if (code === 0) {
      console.log("Shell command executed successfully");
      if (cb) {
        await cb();
      }
    }
  });
};

export { clearTemp, runShellCommand };

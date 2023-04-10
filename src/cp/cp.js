import { spawn } from "child_process";
import path from "path";

const __dirname = path.dirname(process.argv[1]);
const scriptPath = path.join(__dirname, "files", "script.js");

const spawnChildProcess = async (...args) => {
  // Write your code here

  const child = spawn("node", [scriptPath, args]);

  process.stdin.pipe(child.stdin);
  child.stdout.pipe(process.stdout);

  child.on("exit", function (code) {
    console.log("Child process exited with code " + code);
  });
};

// Put your arguments in function call to test this functionality
spawnChildProcess(["someArgument1", "someArgument2"]);

import { Worker } from "node:worker_threads";
import os from "os";
import path from "path";
const numCPUs = os.cpus().length;

const __dirname = path.dirname(process.argv[1]);
const workerPath = path.join(__dirname, "worker.js");

let results = [];
const performCalculations = async () => {
  // Write your code here
  for (let i = 0; i < numCPUs; i++) {
    let worker = new Worker(workerPath);

    worker.postMessage(i + 10);
    worker.on("message", (message) => {
      results.push({ status: "resolved", data: message });
      if (results.length === numCPUs) {
        console.log(results);
      }
    });

    worker.on("error", () => {
      results.push({ status: "error", data: null });
      if (results.length === numCPUs) {
        console.log(results);
      }
    });
  }
};

await performCalculations();

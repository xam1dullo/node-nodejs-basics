import { parentPort } from "node:worker_threads";

// n should be received from main thread
const nthFibonacci = (n) =>
  n < 2 ? n : nthFibonacci(n - 1) + nthFibonacci(n - 2);

let numberReceived;
parentPort.on("message", (message) => {
  numberReceived = message;
  sendResult();
});

const sendResult = () => {
  // This function sends result of nthFibonacci computations to main thread
  const numberToSend = nthFibonacci(numberReceived);

  parentPort.postMessage(numberToSend);
};

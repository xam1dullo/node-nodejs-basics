import path from "path";
import { createReadStream } from "node:fs";

const __dirname = path.dirname(process.argv[1])

const folder = "files";
const file = "fileToRead.txt";

const read = async (folder, file) => {
  try {
    // Write your code here
    const filePath = path.join(__dirname,folder, file);
    createReadStream(filePath).pipe(process.stdout);
  } catch (e) {
    console.log(e);
  }
};

await read(folder, file);

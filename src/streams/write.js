import path from "path";
import fs from "node:fs";

const __dirname = path.dirname(process.argv[1]);

const folder = "files";
const file = "fileToRead.txt";

const write = async (folder, file) => {
  try {
    // Write your code here
    const filePath = path.join(__dirname, folder, file);
    const outputStream = fs.createWriteStream(filePath);

    process.stdin.pipe(outputStream);
  } catch (e) {
    console.log(e);
  }
};

await write(folder, file);

import path from "path";
import fs from "node:fs";

const __dirname = path.dirname(process.argv[1]);

const folder = "files";
const file = "fileToWrite.txt";

const write = async (filePath, context) => {
    try {
        // Write your code here
        const outputStream = fs.createWriteStream(filePath);
        outputStream.write(context);
        process.stdin.pipe(outputStream);
    } catch (e) {
        console.log(e);
    }
};

write(path.join(__dirname, folder, file), "Hello World");

export default write;

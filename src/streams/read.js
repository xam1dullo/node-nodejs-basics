import path from "path";
import { createReadStream } from "node:fs";

const __dirname = path.dirname(process.argv[1]);

const folder = "files";
const file = "fileToRead.txt";

const read = async (filePath) => {
    try {
        // Write your code here
        createReadStream(filePath).pipe(process.stdout);
    } catch (e) {
        console.log(e);
    }
};

export default read;

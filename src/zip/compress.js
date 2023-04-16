import { createGzip } from "node:zlib";
import path from "path";
import fs from "node:fs";

const __dirname = path.dirname(process.argv[1]);

const folder = "files";
const file = "fileToCompress.txt";
const archiveFileName = "archive.gz";

const compress = async (sourcePath, destinationPath) => {
    // Write your code here
    const zip = createGzip();
    const output = fs.createWriteStream(destinationPath);
    fs.createReadStream(sourcePath).pipe(zip).pipe(output);
};

export default compress;

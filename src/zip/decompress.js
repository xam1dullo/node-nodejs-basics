import { createGunzip } from "zlib";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(process.argv[1]);

const archiveFileName = "archive.gz";
const folder = "files";
const file = "fileToCompress.txt";

const decompress = async (sourcePath, destinationPath) => {
    const input = fs.createReadStream(sourcePath);
    const unzip = createGunzip();
    const output = fs.createWriteStream(destinationPath);

    input.pipe(unzip).pipe(output);
};

export default decompress;

import { createGzip } from "node:zlib";
import path from "path";
import fs from "node:fs";

const __dirname = path.dirname(process.argv[1]);

const folder = "files";
const file = "fileToCompress.txt";
const archiveFileName = "archive.gz";

const compress = async (srcFolder, srcFile, dstnFolder, dstnFile) => {
  // Write your code here
  const srcPath = path.join(__dirname, srcFolder, srcFile);
  const dstnPath = path.join(__dirname, dstnFolder, dstnFile);

  const zip = createGzip();
  const output = fs.createWriteStream(dstnPath);

  await fs.createReadStream(srcPath).pipe(zip).pipe(output);
};

await compress(folder, file, folder, archiveFileName);

import { createGunzip } from "zlib";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(process.argv[1]);

const archiveFileName = "archive.gz";
const folder = "files";
const file = "fileToCompress.txt";

const decompress = async (srcFolder, srcFile, dstnFolder, dstnFile) => {
  const srcPath = path.join(__dirname, srcFolder, srcFile);
  const dstnPath = path.join(__dirname, dstnFolder, dstnFile);

  const input = fs.createReadStream(srcPath);
  const unzip = createGunzip();
  const output = fs.createWriteStream(dstnPath);

  input.pipe(unzip).pipe(output);
};

await decompress(folder, archiveFileName, folder, file);

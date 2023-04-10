import crypto from "node:crypto";
import path from "node:path";
import fs from "node:fs";

const __dirname = path.dirname(process.argv[1]);

const folder = "files";
const file = "fileToCalculateHashFor.txt";

const calculateHash = async (folder, file) => {
  const filePath = path.join(__dirname, folder, file);
  const hash = await crypto.createHash("sha256");

  const rs = await fs.createReadStream(filePath);

  rs.on("readable", () => {
    const data = rs.read();
    if (data) {
      hash.update(data);
    } else {
      console.log(hash.digest("hex"));
    }
  });
};

await calculateHash(folder, file);

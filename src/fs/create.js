import fs from "node:fs/promises";
import path from "node:path";

const __dirname = path.dirname(process.argv[1]);

const file = "fresh.txt";
const folder = "files";
const content = "I am fresh and young";
const error = "FS operation failed";

const isExistFile = async (path) => {
    try {
        await fs.access(path);
        return true;
    } catch (error) {
        return false;
    }
};

const create = async (filePath) => {
    const result = await isExistFile(filePath);
    if (!result) {
        const fileHandle = await fs.open(filePath, "w");
        fileHandle.write(content);
        fileHandle.close();
        return "A new file was successfully created";
    }
    new Error("FS operation failed");
};

export default create;

import fs from "node:fs/promises";
import path from "node:path";

const __dirname = path.dirname(process.argv[1]);
const __filename = path.basename(process.argv[1]);

const folder = "files";
const file = "fileToRemove.txt";
const error = "FS operation failed";

const isExist = async (path) => {
    try {
        await fs.access(path);
        return true;
    } catch (e) {
        return false;
    }
};

const remove = async (filePath) => {
    // Write your code here
    try {
        const isExistFile = await isExist(filePath);
        if (!isExistFile) {
            throw new Error(error);
        }
        await fs.unlink(filePath);
    } catch (e) {
        console.log(e);
    }
};

export default remove;

import fs from "node:fs/promises";
import path from "node:path";
import list from "./list.js";
const __dirname = path.dirname(process.argv[1]);

const folder = "files";
const folder_copy = "files_copy";
const error = "FS operation failed";

const isExist = async (path) => {
    try {
        await fs.access(path, fs.constants.F_OK);
        return true;
    } catch (e) {
        return false;
    }
};
const copy = async (sourcePath, copyPath) => {
    try {
        const isExistSource = await isExist(sourcePath);
        const isExistCopy = await isExist(copyPath);

        if (!isExistSource || isExistCopy) throw new Error(error);

        const createCopyFolder = await fs.mkdir(copyPath);
        if (createCopyFolder) throw new Error(error);

        const files = await fs.readdir(sourcePath);
        for await (const file of files) {
            const source = path.join(sourcePath, file);
            const destination = path.join(copyPath, file);
            await fs.copyFile(source, destination);
        }
    } catch (e) {
        console.log(e);
    }
};

export default copy;

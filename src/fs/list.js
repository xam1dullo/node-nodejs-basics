import fs from "node:fs/promises";
import path from "node:path";

const __dirname = path.dirname(process.argv[1])
const __filename = path.basename(process.argv[1])


const folder = "files";
const error = "FS operation failed";

const isExist = async (path) => {
    try {
        await fs.access(path, fs.constants.F_OK)
        return true
    } catch (e) {
        return false
    }
}

const list = async (folder) => {
    try {
        // Write your code here
        const sourcePath = path.join(__dirname, folder);
        const isExistSource = await isExist(sourcePath);
        if (!isExistSource) throw new Error(error);

        const files = await fs.readdir(sourcePath);
        for await (const file of files) {
            console.log(file);
        }

    } catch (e) {
        console.log(e)
    }
};

await list(folder);
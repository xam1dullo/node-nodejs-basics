import fs from "node:fs/promises";
import path from "node:path";

const __dirname = path.dirname(process.argv[1])


const folder = "files";
const file = "fileToRead.txt";
const error = "FS operation failed";

const isExist = async (path) => {
    try {
        await fs.access(path, fs.constants.F_OK)
        return true
    } catch (e) {
        return false
    }
}


const read = async (fileName) => {
    // Write your code here
    try {
        const filePath = path.join(__dirname, folder, fileName);
        const file = await fs.open(filePath);
        for await (const line of file.readLines()) {
            console.log(line);
        }
    } catch (e) {
        console.log(e);
        throw new Error(error)
    }
};

await read(file)
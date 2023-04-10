import fs from "node:fs/promises";
import path from "node:path";

const __dirname = path.dirname(process.argv[1])

const folder = "files";
const wrongFilename = "wrongFilename.txt";
const properFilename = "properFilename.md";
const error = "FS operation failed";


const isExist = async (path) => {
    try {
        await fs.access(path)
        return true
    } catch (e) {
        return false
    }
}

const rename = async (oldName, newName) => {
    try {
        // Write your code here
        const oldPath = path.join(__dirname, folder, oldName)
        const newPath = path.join(__dirname, folder, newName)

        const isExistOldPath = await isExist(oldPath)
        if (!isExistOldPath){
            throw new Error(error)
        }
        const isExistNewPath = await isExist(newPath)
        if (isExistNewPath) {
            throw new Error(error)
        }
        await fs.rename(oldPath, newPath)
    } catch (e) {
        console.log(e)
    }
};

await rename(wrongFilename, properFilename)
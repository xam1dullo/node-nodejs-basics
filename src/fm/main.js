import fs from "node:fs/promises";
import {
    copyFileSync,
    createReadStream,
    createWriteStream,
    mkdir,
} from "node:fs";
import path from "node:path";
import os from "node:os";
import zlib from "zlib";

import { createInterface } from "node:readline";

import read from "../fs/read.js";
import rename from "../fs/rename.js";
import create from "../fs/create.js";

import calculateHash from "../hash/calcHash.js";
import {
    __dirname,
    commands,
    messages,
    paths,
    colours,
    isExist,
} from "./helper.js";
/* 
const usernameIndex = process.argv.indexOf("--username");
const username = usernameIndex !== -1 ? process.argv[usernameIndex + 1] : null;

console.log(username);
 */

const args = process.argv.slice(2);
const params = new Map(args.map((arg) => arg.split("=")));
const userName = params.get("--username")?.trim() || "User";

console.log(messages.welcomeMessage(userName));

const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
});

function colorTrace(msg, color) {
    console.log("%c" + msg, "color:" + color + ";font-weight:bold;");
}
let currentDir = os.homedir();

const clearAndDisplayCurrentDir = () => {
    process.stdout.write("\x1Bc");
    console.log(
        messages.currentDirMessage(),
        colours.fg.green,
        currentDir,
        colours.reset
    );
};
const commandFunc = {
    up: () => {
        try {
            //clear screen and display current directory with green text
            currentDir = path.join(currentDir, "../");
        } catch (error) {
            console.log(messages.errorMessage);
        }
    },
    cd: async (args) => {
        try {
            // change directory to dir if it does not exist display error message
            if (args.length !== 1) {
                console.log(messages.errorMessage);
                return;
            }

            const newPath = path.isAbsolute(args[0])
                ? args[0]
                : path.join(currentDir, args[0]);

            const folderExist = await isExist(newPath);

            if (!(await fs.lstat(newPath)).isDirectory()) {
                console.log(messages.errorMessage);
                return;
            }

            if (!(path.parse(newPath).root === args[0]) && folderExist) {
                currentDir = newPath;
            }
        } catch (error) {
            console.log(messages.errorMessage);
        }
    },
    ls: async () => {
        try {
            const dirContents = await fs.readdir(currentDir);
            const statsPromises = dirContents.map((name) =>
                fs.stat(path.join(currentDir, name))
            );

            const stats = await Promise.all(statsPromises);
            const files = [];
            const directories = [];

            stats.forEach((stat, i) => {
                const name = dirContents[i];
                const type = stat.isDirectory() ? "Directory" : "File";
                const item = { name, type };

                if (stat.isDirectory()) {
                    directories.push(item);
                } else {
                    files.push(item);
                }
            });

            directories.sort((a, b) => a.name.localeCompare(b.name));
            files.sort((a, b) => a.name.localeCompare(b.name));
            const data = [...directories, ...files];

            console.table(data, ["name", "type"], "Directory Contents");
        } catch (error) {
            console.log(messages.errorMessage);
        }
    },
    cat: async (args) => {
        // display file contents
        try {
            if (args.length !== 1) {
                console.log(messages.errorMessage);
                return;
            }
            const sourcePath = path.isAbsolute(args[0])
                ? args[0]
                : path.join(currentDir, args[0]);
            const fileExist = await isExist(sourcePath);
            if (!fileExist) {
                console.log(messages.errorMessage);
                return;
            }
            read(sourcePath);
        } catch (error) {
            console.log(messages.errorMessage);
        }
    },
    add: async (args) => {
        try {
            // add file to current directory
            if (args.length !== 1) {
                console.log(messages.errorMessage);
                return;
            }

            const filePath = path.join(currentDir, args[0]);
            const fileExist = await isExist(filePath);
            if (fileExist) {
                console.log(messages.errorMessage);
                return;
            }
            create(filePath);
        } catch (error) {
            console.log(messages.errorMessage);
        }
    },
    rn: async (args) => {
        try {
            // rename file
            if (args.length !== 2) {
                console.log(messages.errorMessage);
                return;
            }

            const sourcePath = path.isAbsolute(args[0])
                ? args[0]
                : path.join(currentDir, args[0]);
            const destinationPath = path.isAbsolute(args[1])
                ? args[1]
                : path.join(currentDir, args[1]);

            const destinationDir = path.dirname(destinationPath);
            if (
                (await isExist(destinationDir)) &&
                destinationDir !== currentDir
            ) {
                console.log(messages.errorMessage);
                return;
            }

            const sourceExist = await isExist(sourcePath);
            const destinationExist = await isExist(destinationPath);

            if (sourceExist && destinationExist) {
                console.log(messages.errorMessage);
                return;
            }
            rename(sourcePath, destinationPath);
        } catch (error) {
            console.log(messages.errorMessage);
        }
    },
    cp: async (args) => {
        try {
            // copy file
            if (args.length !== 2) {
                console.log(messages.errorMessage);
                return;
            }

            const sourcePath = path.isAbsolute(args[0])
                ? args[0]
                : path.join(currentDir, args[0]);
            const destinationPath = path.isAbsolute(args[1])
                ? args[1]
                : path.join(currentDir, args[1]);

            const destinationDir = path.dirname(destinationPath);

            const sourceExist = await isExist(sourcePath);
            const destinationExist = await isExist(destinationPath);

            if (!sourceExist) {
                console.log({
                    sourceExist,
                    destinationExist,
                    msg: "error",
                });
                console.log(messages.errorMessage);
                return;
            }
            if (destinationExist) {
                await fs.mkdir(destinationDir, { recursive: true });
            }
            const readStream = createReadStream(sourcePath);
            const writeStream = createWriteStream(destinationPath);

            readStream.pipe(writeStream);

            readStream.on("finish", () => {
                console.log("File copied successfully");
            });
        } catch (error) {
            console.log(messages.errorMessage);
        }
    },

    mv: async (args) => {
        try {
            if (args.length !== 2) {
                console.log(messages.errorMessage);
                return;
            }
            const sourcePath = path.isAbsolute(args[0])
                ? args[0]
                : path.join(currentDir, args[0]);
            const destinationPath = path.isAbsolute(args[1])
                ? args[1]
                : path.join(currentDir, args[1]);

            const sourceExist = await isExist(sourcePath);
            const destinationExist = await isExist(destinationPath);

            if (!sourceExist) {
                console.log(messages.errorMessage);
                return;
            }
            if (!destinationExist) {
                console.log({
                    sourceExist,
                    destinationExist,
                    msg: "error",
                });
                await fs.mkdir(destinationPath, { recursive: true });
            }
            const source = await createReadStream(sourcePath);
            const destination = await createWriteStream(destinationPath);
            await source.pipe(destination);
            await fs.unlink(sourcePath);
        } catch (error) {
            console.log({
                msg: error.message,
                error,
            });
            console.log(messages.errorMessage);
        }
    },
    rm: async (args) => {
        try {
            // remove file
            if (args.length !== 1) {
                console.log(messages.errorMessage);
                return;
            }

            const sourcePath = path.isAbsolute(args[0])
                ? args[0]
                : path.join(currentDir, args[0]);

            const sourceExist = await isExist(sourcePath);

            if (!sourceExist) {
                console.log({
                    msg: "error",
                    sourceExist,
                    sourcePath,
                });
                console.log(messages.errorMessage);
                return;
            }
            const dir = await fs.stat(sourcePath);
            if (dir.isDirectory()) {
                await fs.rmdir(sourcePath);
            } else {
                await fs.unlink(sourcePath);
            }
        } catch (err) {
            console.log({
                msg: err.message,
                err,
            });
            console.error(messages.errorMessage);
        }
    },
    os: async (args) => {
        // display operating system information
        try {
            if (args.length !== 1) {
                console.log(messages.errorMessage);
                return;
            }
            const param = args[0].split("--")[1];
            if (param == "EOL") {
                console.log(
                    `The End of Line character is: ${JSON.stringify(os.EOL)}`
                );
            } else if (param == "cpus") {
                const cpus = os.cpus();
                console.log(`Number of CPUs: ${cpus.length}`);

                cpus.forEach((cpu, index) => {
                    console.log(`CPU ${index}:`);
                    console.log(`  Model: ${cpu.model}`);
                    console.log(`  Speed: ${cpu.speed / 1000} GHz`);
                });
            } else if (param == "homedir") {
                const homedir = os.homedir();
                console.log(`Home directory: ${homedir}`);
            } else if (param == "username") {
                const username = os.userInfo().username;
                console.log(`Current user: ${username}`);
            } else if (param == "architecture") {
                const cpuArch = os.arch();
                console.log(`CPU architecture: ${cpuArch}`);
            } else {
                console.log(messages.errorMessage);
            }
        } catch (error) {
            console.log(messages.errorMessage);
        }
    },
    hash: async (args) => {
        // display file hash
        try {
            if (args.length !== 1) {
                console.log(messages.errorMessage);
                return;
            }
            const filePath = path.isAbsolute(args[0])
                ? args[0]
                : path.join(currentDir, args[0]);

            const sourceExist = await isExist(filePath);

            if (!sourceExist) {
                console.log({
                    msg: "error",
                    sourceExist,
                    filePath,
                });

                console.log(messages.errorMessage);
                return;
            }

            calculateHash(filePath);
        } catch (error) {
            console.log(messages.errorMessage);
        }
    },
    compress: async (args) => {
        // compress file
        try {
            if (args.length !== 2) {
                console.log(args);
                console.log(messages.errorMessage);
                return;
            }
            const sourcePath = path.isAbsolute(args[0])
                ? args[0]
                : path.join(currentDir, args[0]);
            const destinationPath = path.isAbsolute(args[1])
                ? args[1]
                : path.join(currentDir, args[1]);

            const sourceExist = await isExist(sourcePath);
            const destinationExist = await isExist(destinationPath);

            if (!sourceExist || destinationExist) {
                console.log(messages.errorMessage);
                return;
            }
            const sourceStream = createReadStream(sourcePath);
            const destinationStream = createWriteStream(destinationPath);
            sourceStream
                .pipe(zlib.createBrotliCompress())
                .pipe(destinationStream)
                .on("finish", () => {
                    console.log(
                        `File compressed successfully to ${destinationPath}`
                    );
                })
                .on("error", (error) => {
                    console.log(
                        `Error occurred while compressing file: ${error}`
                    );
                });
        } catch (error) {
            console.log(error);
            console.log(messages.errorMessage);
        }
    },
    decompress: async (args) => {
        // decompress file
        try {
            if (args.length !== 2) {
                console.log(args);
                console.log(messages.errorMessage);
                return;
            }
            const sourcePath = path.isAbsolute(args[0])
                ? args[0]
                : path.join(currentDir, args[0]);
            const destinationPath = path.isAbsolute(args[1])
                ? args[1]
                : path.join(currentDir, args[1]);

            const sourceExist = await isExist(sourcePath);
            const destinationExist = await isExist(destinationPath);

            if (!sourceExist || destinationExist) {
                console.log({
                    msg: "error",
                    sourceExist,
                    destinationExist,
                    sourcePath,
                    destinationPath,
                });
                console.log(messages.errorMessage);
                return;
            }
            const brStream = createReadStream(sourcePath);
            const unzipStream = zlib.createBrotliDecompress();
            const writeStream = createWriteStream(destinationPath);
            brStream.pipe(unzipStream).pipe(writeStream);

            await new Promise((resolve, reject) => {
                writeStream.on("finish", resolve);
                writeStream.on("error", reject);
            });
            console.log("File decompressed successfully!");
        } catch (error) {
            console.log({
                msg: error,
            });
            console.log(messages.errorMessage);
        }
    },
    clear: () => {
        clearAndDisplayCurrentDir();
    },
    ".exit": () => {
        console.log(messages.directoryMessage());
        process.exit(0);
    },
    ".help": () => {
        //get help
        console.log(`The following commands are available:
        up: move up one directory
        cd: change directory
        ls: list directory contents
        cat: display file contents
        mv: move file
        rm: remove file
        os: display operating system information
        hash: display file hash
        compress: compress file
        decompress: decompress file
        .exit: exit the program
        ctrl+c: exit the program
        .help: display this help message`);
    },
};

rl.on("line", (input) => {
    const [cmd, ...args] = input.trim().split(" ");
    const command = commands.indexOf(cmd) > -1 ? cmd : null;
    if (!command) {
        console.log(messages.invalidMessage);
        return;
    }

    commandFunc[command](args);
});

process.on("SIGINT", () => {
    process.exit(0);
});

process.on("beforeExit", () => {
    console.log(messages.directoryMessage());
});

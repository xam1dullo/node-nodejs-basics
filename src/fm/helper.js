import path from "node:path";
import fs from "node:fs/promises";
const __dirname = path.dirname(process.argv[1]);

const paths = {
    srcDir: path.join(__dirname, "../"),
    cliDir: path.join(__dirname, "../", "cli"),
    fsDir: path.join(__dirname, "../", "fs"),
    hashDir: path.join(__dirname, "../", "hash"),
    streamsDir: path.join(__dirname, "../", "streams"),
    wsDir: path.join(__dirname, "../", "ws"),
    zipDir: path.join(__dirname, "../", "zip"),
};

let user = {};

const messages = {
    welcomeMessage(userName) {
        user = { userName };
        return `Welcome to the File Manager, ${userName}!`;
    },
    directoryMessage() {
        return `Thank you for using File Manager, ${user.userName}, goodbye!`;
    },
    currentDirMessage() {
        return `You are currently in`;
    },
    invalidMessage: "Invalid input",
    errorMessage: "Operation failed",
};

const commands = [
    "up",
    "cd",
    "ls",
    "cat",
    "add",
    "rn",
    "cp",
    "mv",
    "rm",
    "os",
    "hash",
    "compress",
    "decompress",
    ".exit",
    "ctrl+c",
    ".help",
    "clear",
];

const colours = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    blink: "\x1b[5m",
    reverse: "\x1b[7m",
    hidden: "\x1b[8m",

    fg: {
        black: "\x1b[30m",
        red: "\x1b[31m",
        green: "\x1b[32m",
        yellow: "\x1b[33m",
        blue: "\x1b[34m",
        magenta: "\x1b[35m",
        cyan: "\x1b[36m",
        white: "\x1b[37m",
        gray: "\x1b[90m",
        crimson: "\x1b[38m", // Scarlet
    },
    bg: {
        black: "\x1b[40m",
        red: "\x1b[41m",
        green: "\x1b[42m",
        yellow: "\x1b[43m",
        blue: "\x1b[44m",
        magenta: "\x1b[45m",
        cyan: "\x1b[46m",
        white: "\x1b[47m",
        gray: "\x1b[100m",
        crimson: "\x1b[48m",
    },
};

//export { __dirname, command, messages, paths };

// Path: src/fm/helper.js

const isExist = async (target) => {
    const source = path.isAbsolute(target)
        ? target
        : path.join(this.current_dir, target);
    return fs
        .access(source, fs.constants.R_OK)
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
};

export { __dirname, commands, messages, paths, colours, isExist };

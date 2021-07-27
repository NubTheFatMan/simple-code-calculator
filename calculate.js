let useWhitelist = true; 
let blacklistedTypes = ["png", "txt", "dll"]; // If useWhitelist is false, any files with these extensions are only counted as a file, not as chars, lines, etc
let whitelistedTypes = ['cs', 'cpp', 'js', 'lua']; // If useWhitelist is true, only these file's characters, lines, etc are read. The rest are just counted as a file

let calculate = "Rain-World-Drought-master"; // The folder to be calculating. Relative to wherever you put this file

// No more config after this point ( ͡° ͜ʖ ͡°)
//------------------------------------------

const fs = require('fs');

let dirs = 0;
let filesC = 0;
let lines = 0;
let linesNotBlank = 0;
let chars = 0;
let charsNoSpaces = 0;

function strEndsWithValues(str, vals) {
    for (let i = 0; i < vals.length; i++) {
        if (str.endsWith(vals[i])) return true;
    }
    return false;
}

function readFile(file) {
    console.log("Reading file " + file);
    let code = fs.readFileSync(file, 'utf-8');
    filesC++;
    chars += code.length;
    charsNoSpaces += code.replace(/ /g, '').length;

    let fileLineBreaks = code.match(/\r?\n/g) || [];
    lines += fileLineBreaks.length;

    let linesContent = code.split(/\r?\n/g) || [];
    for (let i = 0; i < linesContent.length; i++) {
        if (linesContent[i].trim() !== "") linesNotBlank++;
    }
}

function countFile(file) {
    console.log("Counting file " + file);
    filesC++;
}

function readDir(dir) {
    console.log("Opening directory " + dir);
    let files = fs.readdirSync(dir);
    dirs++;
    for (let i = 0; i < files.length; i++) {
        if (files[i].includes(".")) {
            if (useWhitelist) {
                if (!strEndsWithValues(files[i], whitelistedTypes)) {
                    countFile(dir + "/" + files[i]);
                    continue;
                }
            } else {
                if (strEndsWithValues(files[i], blacklistedTypes)) {
                    countFile(dir + "/" + files[i]);
                    continue;
                }
            }

            try {
                readFile(dir + "/" + files[i]);
            } catch (err) {}
        } else {
            try {
                readDir(dir + "/" + files[i]);
            } catch (err) {}
        }
    }
}

readDir(calculate);

// Calculate mod size based on read files
let units = ['Bytes', 'KiloBytes', 'MegaBytes', 'GigaBytes', 'TeraBytes'];
let ind = 0;
let size = chars;
while (size >= 1024 && ind < units.length) {
    size /= 1024;
    ind++;
}

let sizeStr = `${size.toFixed(2)} ${units[ind]}`;

console.log('\n\n');
console.log(`Scanned directory: ${calculate}\n`);
console.log(`Sub-directories: ${dirs}`);
console.log(`Files: ${filesC}`);
console.log(`Lines of code: ${lines}`);
console.log(`Lines of code (Not blank): ${linesNotBlank}`);
console.log(`Blank lines of code: ${lines - linesNotBlank}`);
console.log(`Characters: ${chars} (${sizeStr})`);
console.log(`Characters (No spaces): ${charsNoSpaces}`);
console.log(`Blank characters: ${chars - charsNoSpaces}`);
import { User } from "discord.js";
import { appendFile, readFileSync, writeFile } from "fs";

interface bDay {
    id: string,
    day: number;
}

let bDays: bDay[];
let filePath = "src/birthday/birthdays.json";
let backupFilePath = "src/birthday/backup.json";

export function initBDayStorage() {
    importBDays();
}

function importBDays() {
    let str: string = readFileSync(filePath, {flag: 'a+'}).toString();;
    try {
        bDays = JSON.parse(str);
    }
    catch(err) {
        console.warn(`Unable to read bDay file: ${bDays}`);
        console.warn(`making new bDay file`);
        appendFile(backupFilePath, str, res => `Backed up data to ${backupFilePath}: \n${res}`);
    }
}

function exportBDays() {
    writeFile(filePath, JSON.stringify(bDays), err => {
        console.log(`Error exporting birthday file: ${err}`);
    })
}

export function getBDay(id: string) {
    return bDays.find(value => {
        return value.id == id? true: false;
    })
}
import { User } from "discord.js";
import { appendFile, readFileSync, writeFile } from "fs";

interface bDay {
    id: string,
    date: string;
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
        bDays = [];
        exportBDays();
    }
}

function exportBDays() {
    writeFile(filePath, JSON.stringify(bDays), err => {
        console.log(`Error exporting birthday file: ${err}`);
    })
}

export function getBDay(id: string): string { 
    return bDays.find(el => {
        return el.id == id;
    }).date;
}
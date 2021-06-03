import { User } from "discord.js";
import { readFileSync, writeFile } from "fs";

let bDays: Object;
let filePath = "src/birthday/birthdays.json"

export function importBDays() {
    bDays = JSON.parse(readFileSync(filePath).toString());
}

export function exportBDays() {
    writeFile(filePath, JSON.stringify(bDays), err => {
        console.log(`Error exporting birthday file: ${err}`);
    })
}




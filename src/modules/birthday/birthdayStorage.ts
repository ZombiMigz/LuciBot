import { appendFile, readFileSync, writeFile } from 'fs';

interface bDay {
  id: string;
  date: string;
}

let bDays: bDay[];
let filePath = "src/birthday/birthdays.json";
let backupFilePath = "src/birthday/backup.json";

export function initBDayStorage() {
  importBDays();
}

function importBDays() {
  let str: string = readFileSync(filePath, { flag: "a+" }).toString();
  try {
    bDays = JSON.parse(str);
  } catch (err) {
    console.warn(`Unable to read bDay file: ${bDays}`);
    console.warn(`making new bDay file`);
    appendFile(
      backupFilePath,
      str,
      (res) => `Backed up data to ${backupFilePath}: \n${res}`
    );
    bDays = [];
    exportBDays();
  }
}

function exportBDays() {
  writeFile(filePath, JSON.stringify(bDays), (err) => {
    if (err) console.log(`Error exporting birthday file: ${err}`);
  });
}

export function getBDay(id: string): string {
  let data = bDays.find((el) => {
    return el.id == id;
  });
  if (data == null) return "0000";
  return data.date;
}

export function setBDay(id: string, date: string) {
  let i: number = bDays.findIndex((day: bDay) => {
    return day.id == id;
  });
  if (i == -1) bDays.push({ id, date });
  else bDays[i] = { id, date };
  exportBDays();
}

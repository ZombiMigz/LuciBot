"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setBDay = exports.getBDay = exports.initBDayStorage = void 0;
var fs_1 = require("fs");
var bDays;
var filePath = "src/birthday/birthdays.json";
var backupFilePath = "src/birthday/backup.json";
function initBDayStorage() {
    importBDays();
}
exports.initBDayStorage = initBDayStorage;
function importBDays() {
    var str = fs_1.readFileSync(filePath, { flag: "a+" }).toString();
    try {
        bDays = JSON.parse(str);
    }
    catch (err) {
        console.warn("Unable to read bDay file: " + bDays);
        console.warn("making new bDay file");
        fs_1.appendFile(backupFilePath, str, function (res) { return "Backed up data to " + backupFilePath + ": \n" + res; });
        bDays = [];
        exportBDays();
    }
}
function exportBDays() {
    fs_1.writeFile(filePath, JSON.stringify(bDays), function (err) {
        if (err)
            console.log("Error exporting birthday file: " + err);
    });
}
function getBDay(id) {
    return bDays.find(function (el) {
        return el.id == id;
    }).date;
}
exports.getBDay = getBDay;
function setBDay(id, date) {
    var i = bDays.findIndex(function (day) {
        return day.id == id;
    });
    if (i == -1)
        bDays.push({ id: id, date: date });
    else
        bDays[i] = { id: id, date: date };
    exportBDays();
}
exports.setBDay = setBDay;

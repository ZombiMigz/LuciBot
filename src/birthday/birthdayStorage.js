"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBDay = exports.initBDayStorage = void 0;
var fs_1 = require("fs");
var bDays;
var filePath = "src/birthday/birthdays.json";
var backupFilePath = "src/birthday/backup.json";
function initBDayStorage() {
    importBDays();
}
exports.initBDayStorage = initBDayStorage;
function importBDays() {
    var str = fs_1.readFileSync(filePath, { flag: 'a+' }).toString();
    ;
    try {
        bDays = JSON.parse(str);
    }
    catch (err) {
        console.warn("Unable to read bDay file: " + bDays);
        console.warn("making new bDay file");
        fs_1.appendFile(backupFilePath, str, function (res) { return "Backed up data to " + backupFilePath + ": \n" + res; });
    }
}
function exportBDays() {
    fs_1.writeFile(filePath, JSON.stringify(bDays), function (err) {
        console.log("Error exporting birthday file: " + err);
    });
}
function getBDay(id) {
    return bDays.find(function (value) {
        return value.id == id ? true : false;
    });
}
exports.getBDay = getBDay;

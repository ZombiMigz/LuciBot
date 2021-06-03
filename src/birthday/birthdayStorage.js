"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportBDays = exports.importBDays = void 0;
var fs_1 = require("fs");
var bDays;
var filePath = "src/birthday/birthdays.json";
function importBDays() {
    bDays = JSON.parse(fs_1.readFileSync(filePath).toString());
}
exports.importBDays = importBDays;
function exportBDays() {
    fs_1.writeFile(filePath, JSON.stringify(bDays), function (err) {
        console.log("Error exporting birthday file: " + err);
    });
}
exports.exportBDays = exportBDays;

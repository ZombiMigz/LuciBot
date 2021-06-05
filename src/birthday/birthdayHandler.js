"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bDayCommand = exports.initBDayHandler = void 0;
var settingsHandler_1 = require("../settingsHandler");
var birthdayStorage_1 = require("./birthdayStorage");
function initBDayHandler() {
    birthdayStorage_1.initBDayStorage();
}
exports.initBDayHandler = initBDayHandler;
function bDayCommand(msg) {
    var content = msg.content.split(' ');
    if (content[1] == 'get') {
        var data = birthdayStorage_1.getBDay(msg.mentions.members.first().id);
        msg.channel.send("Month: " + data.substring(0, 2) + " Day: " + data.substring(2));
    }
    else {
        sendError(msg, "I didn't understand. To use the birthday command type " + settingsHandler_1.prefix + "birthday <get/today>");
    }
}
exports.bDayCommand = bDayCommand;
function sendError(msg, err) {
    msg.channel.send(err);
}

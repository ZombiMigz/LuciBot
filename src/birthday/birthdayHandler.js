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
    var content = msg.content.split(" ");
    if (content[1] == "get") {
        if (msg.mentions.members == null || msg.mentions.members < 1) {
            sendError(msg, "I didn't understand. To get birthdays type ```" +
                settingsHandler_1.prefix +
                "birthday get <@user>```");
        }
        else {
            msg.channel.send(convertBDay(birthdayStorage_1.getBDay(msg.mentions.members.first().id)));
        }
    }
    else if (content[1] == "set") {
        var date = content[2];
        if (Number.isNaN(date.substring(0, 2)) ||
            date[2] != "/" ||
            Number.isNaN(date.substring(3, 5))) {
            sendError(msg, "I didn't understand. To set birthdays type ```" +
                settingsHandler_1.prefix +
                "birthday set mm/dd```");
        }
        else if (Number.parseInt(date.substring(0, 2)) > 12 ||
            Number.parseInt(date.substring(3, 5)) > 31) {
            sendError(msg, "Invalid date");
        }
        else {
            birthdayStorage_1.setBDay(msg.member.id, date.substring(0, 2) + date.substring(3, 5));
            msg.channel.send("Birthday set to: " + convertBDay(birthdayStorage_1.getBDay(msg.member.id)));
        }
    }
    else {
        sendError(msg, "I didn't understand. To use the birthday command type ```" +
            settingsHandler_1.prefix +
            "birthday <get/today>```");
    }
}
exports.bDayCommand = bDayCommand;
function convertBDay(data) {
    return "Month: " + data.substring(0, 2) + " Day: " + data.substring(2);
}
function sendError(msg, err) {
    msg.channel.send(err);
}

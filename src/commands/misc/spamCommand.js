"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spam = void 0;
var settingsHandler_1 = require("../../settingsHandler");
var misunderstood = "Sorry I didn't understand. To use the spam command type ```" +
    settingsHandler_1.prefix +
    "spam <1-5> <@user> <message>```";
function spam(msg) {
    msg.content = msg.content.substring(5);
    var content = msg.content.split(" ");
    var num = Number(content[0]);
    if (num != NaN && num > 0 && num <= 5) {
        for (var i = 0; i < num; i++) {
            msg.channel.send(msg.content.substring(2));
        }
    }
    else {
        error(msg, misunderstood);
    }
}
exports.spam = spam;
function error(msg, err) {
    msg.channel.send(err);
}

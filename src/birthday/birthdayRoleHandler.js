"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initBDayRoleHandler = void 0;
var bot_1 = require("../../bot");
var settingsHandler_1 = require("../settingsHandler");
var birthdayStorage_1 = require("./birthdayStorage");
function initBDayRoleHandler() {
    bot_1.client.on("message", function (msg) {
        if (!msg.author.bot && msg.member.id != "234390474268344321") {
            checkBirthday(msg.member);
        }
    });
    //checks for birthday of all members on startup
    // client.on("ready", () => {
    //   client.guilds.cache.forEach((guild) => {
    //     guild.members.cache.forEach(member => {
    //       checkBirthday(member);
    //     });
    //   });
    // });
}
exports.initBDayRoleHandler = initBDayRoleHandler;
function checkBirthday(member) {
    if (member.roles.cache.some(function (role) { return role.id == settingsHandler_1.birthdayRole; })) {
        if (!isToday(birthdayStorage_1.getBDay(member.id))) {
            member.roles.remove(settingsHandler_1.birthdayRole);
        }
    }
    else {
        if (isToday(birthdayStorage_1.getBDay(member.id))) {
            member.guild.channels.cache.get(settingsHandler_1.announcements).send("EVERYONE WISH A HAPPY BIRTHDAY TO <@" + member.id + ">");
            member.roles.add(settingsHandler_1.birthdayRole);
        }
    }
}
function isToday(date) {
    var now = new Date();
    return (now.getMonth() + 1 == parseInt(date.substring(0, 2)) &&
        now.getDate() == parseInt(date.substring(2, 4)));
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var birthdayHandler_1 = require("./src/birthday/birthdayHandler");
var callHandler_1 = require("./src/call/callHandler");
var commandHandler_1 = require("./src/commands/commandHandler");
var debug_1 = require("./src/debug/debug");
var settingsHandler_1 = require("./src/settingsHandler");
var Discord = require("discord.js");
exports.client = new Discord.Client();
exports.client.on("ready", function () {
    console.log("initializing modules");
    birthdayHandler_1.initBDayHandler();
    callHandler_1.initCallHandler();
    debug_1.initDebugger();
    commandHandler_1.initCommandHandler();
    console.log("LuciBot Online and listening at prefix: " + settingsHandler_1.prefix);
});
exports.client.on("error", function (err) {
    exports.client.login(settingsHandler_1.token);
    console.log("LUCIBOT CRASHED AT " + new Date().getHours() + ":" + new Date().getMinutes() + ": \n" + err);
});
exports.client.options.retryLimit = 5;
exports.client.options.restRequestTimeout = 30000;
console.log("attempting to login");
exports.client
    .login(settingsHandler_1.token)
    .then(function (res) { return console.log("client logged in"); })
    .catch(function (err) { return console.log("Error logging in: " + err); });

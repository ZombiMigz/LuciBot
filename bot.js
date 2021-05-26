"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var callHandler_1 = require("./src/call/callHandler");
var settingsHandler_1 = require("./src/settingsHandler");
var commandHandler_1 = require("./src/commands/commandHandler");
var debug_1 = require("./src/debug/debug");
var Discord = require('discord.js');
exports.client = new Discord.Client();
exports.client.on('ready', function () {
    callHandler_1.initCallHandler();
    debug_1.initDebugger();
    commandHandler_1.initCommandHandler();
    console.log('LuciBot Online and listening at prefix: ' + settingsHandler_1.prefix);
});
exports.client.login(settingsHandler_1.token);

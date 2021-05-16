"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prefix = exports.client = exports.settings = void 0;
exports.settings = require('./src/settings');
var callHandler_1 = require("./src/call/callHandler");
var debug_1 = require("./src/debug/debug");
var Discord = require('discord.js');
exports.client = new Discord.Client();
var token = exports.settings.token;
// const database = require('./database');
// const quotesHandler = require('./src/quotes/Handler');
exports.prefix = '.';
exports.client.on('ready', function () {
    callHandler_1.initCallHandler();
    debug_1.initDebugger();
    console.log('LuciBot Online and listening at prefix: ' + exports.prefix);
    // database.init();
    // quotesHandler.init();
});
/*
client.on('message', msg => {
    if (msg.content.startsWith("spam ")) {
        user = msg.mentions.users.first().toString();
        for (i = 0; i < 10; i++) ping(msg.channel, user);
    }
})
function ping(channel, user) {
    channel.send(`${user}`)
    .then()
    .catch(console.error);
}
*/
exports.client.login(token);

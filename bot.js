"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
var Discord = require('discord.js');
var client = new Discord.Client();
exports.client = client;
var token = 'NjcxMDkwMjE5ODUxODQxNTM3.Xi33eA.14eswi11TKXGpO53cwagp96nBHo';
var callHandler = require('./src/call/callHandler');
// const database = require('./database');
// const quotesHandler = require('./src/quotes/Handler');
var prefix = '.';
client.on('ready', function () {
    callHandler.init();
    console.log('LuciBot Online and listening at prefix: ' + prefix);
    // database.init();
    // quotesHandler.init();
});
client.login(token);

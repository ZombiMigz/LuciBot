"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDebugger = void 0;
var bot_1 = require("../../bot");
var settingsHandler_1 = require("../settingsHandler");
var debugChannel;
function initDebugger() {
    bot_1.client.channels.fetch(settingsHandler_1.debugChannelID).then(function (channel) {
        debugChannel = channel;
        debugChannel.send("Successfully connected to debug channel");
    });
    pingListener();
}
exports.initDebugger = initDebugger;
function pingListener() {
    bot_1.client.on('message', function (msg) {
        if (msg.channel.id == debugChannel.id && msg.content.startsWith("ping")) {
            debugChannel.send("Time between send and receive: " + (new Date().getTime() - msg.createdAt.getTime()) + " ms");
        }
    });
}

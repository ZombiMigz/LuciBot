"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDebugger = void 0;
var bot_1 = require("../../bot");
var channelID = bot_1.settings["Call IDs"]["Debug Channel"];
var debugChannel;
function initDebugger() {
    bot_1.client.channels.fetch(channelID).then(function (channel) {
        debugChannel = channel;
        debugChannel.send("Successfully connected to debug channel");
    });
}
exports.initDebugger = initDebugger;

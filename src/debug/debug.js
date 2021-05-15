"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDebugger = void 0;
var bot_1 = require("../../bot");
var channelList = require('../channelIDs.json');
var debugChannel;
function initDebugger() {
    bot_1.client.channels.fetch(channelList["Debug Channel"]).then(function (channel) {
        debugChannel = channel;
        debugChannel.send("Successfully connected to debug channel");
    });
}
exports.initDebugger = initDebugger;

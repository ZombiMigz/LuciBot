"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCustomCallHandler = void 0;
var bot_1 = require("../../bot");
var createChannelID = require('../channelIDs.json')["Custom Call Creator"];
var createChannel;
var tutorialMsg = "To create your own channel, type ```.create [channelname]``` Make sure to join the channel in 15 seconds or it will delete itself. Have fun!";
function initCustomCallHandler() {
    console.log("create channel id " + createChannelID);
    bot_1.client.channels.fetch(createChannelID)
        .then(function (res) {
        createChannel = res;
        createChannel.bulkDelete(100).catch(console.log);
        createChannel.send(tutorialMsg);
    })
        .catch(function (err) { return console.log("Failed to find call creation text channel"); });
    bot_1.client.on('message', function (msg) { readMessage(msg); });
}
exports.initCustomCallHandler = initCustomCallHandler;
function readMessage(msg) {
    /*if (createChannelID == msg.channel.id) {
        
    }*/
}

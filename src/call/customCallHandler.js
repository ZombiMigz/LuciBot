"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCustomCallHandler = void 0;
var bot_1 = require("../../bot");
var callHandler_1 = require("./callHandler");
var channelList = require('../channelIDs.json');
var createChannelID = channelList["Custom Call Creator"];
var channel;
var tutorialMsg = "To create your own channel, type ```.create [channelname]``` Make sure to join the channel in 15 seconds or it will delete itself. Have fun!";
var msgLengthError = "Your channel name was too long. Please try a shorter name. :)";
var misunderstoodError = "Sorry, I didn't understand.";
function initCustomCallHandler() {
    bot_1.client.channels.fetch(createChannelID)
        .then(function (res) {
        channel = res;
        channel.bulkDelete(100).catch(console.log);
        channel.send(tutorialMsg);
    })
        .catch(function (err) { return console.log("Failed to find call creation text channel"); });
    bot_1.client.on('message', function (msg) { readMessage(msg); });
}
exports.initCustomCallHandler = initCustomCallHandler;
function readMessage(msg) {
    if (msg.author.bot)
        return;
    if (createChannelID == msg.channel.id) {
        if (msg.content.split(' ')[0] == ".create") {
            if (msg.content.length > 100)
                sendError(msg, msgLengthError);
            var name_1 = msg.content.substr(8);
            createChannel(name_1);
            msg.delete();
        }
        else {
            sendError(msg, misunderstoodError + ' ' + tutorialMsg);
        }
    }
}
function createChannel(name) {
    bot_1.client.channels.fetch(channelList["Voice Call Category"])
        .then(function (res) {
        var category = res;
        var guild = category.guild;
        guild.channels.create(name, { type: "voice" }).then(function (channel) {
            channel.setParent(category);
            setTimeout(function () { checkChannel(channel); }, 10000);
        });
    })
        .catch(console.log);
}
function checkChannel(channel) {
    if (channel.members.size < 1) {
        channel.delete();
        return;
    }
    callHandler_1.addTempChannel(channel.id);
}
function sendError(msg, error) {
    channel.send(error)
        .then(function (res) {
        res.delete({ timeout: 5000 });
    })
        .catch(console.log);
    msg.delete({ timeout: 5000 });
}

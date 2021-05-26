"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCustomCallHandler = void 0;
var bot_1 = require("../../bot");
var callHandler_1 = require("./callHandler");
var channelList = bot_1.settings["Call IDs"];
var createChannelID = channelList["Custom Call Creator"];
var channel;
var tutorialMsg = "To create your own channel, type ```.create [channelname]``` Make sure to join the channel in 15 seconds or it will delete itself. Have fun!";
var msgLengthError = "Your channel name was too long or too short. Please keep the name between 1-100 characters. :)";
var misunderstoodError = "Sorry, I didn't understand.";
var unknownError = "I did not understand the channel name. Please try again.";
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
        if (msg.content.split(' ')[0] == bot_1.prefix + "create") {
            var name_1 = msg.content.substr(8);
            if (name_1.length > 100 || name_1.length < 1) {
                sendError(msg, msgLengthError);
                return;
            }
            else {
                createChannel(msg, name_1);
                msg.delete();
            }
            ;
        }
        else {
            sendError(msg, misunderstoodError + ' ' + tutorialMsg);
        }
    }
}
function createChannel(msg, name) {
    bot_1.client.channels.fetch(channelList["Voice Call Category"])
        .then(function (res) {
        var category = res;
        var guild = category.guild;
        try {
            guild.channels.create(name, { type: "voice" }).then(function (channel) {
                channel.setParent(category);
                setTimeout(function () { checkChannel(channel); }, 10000);
            });
        }
        catch (err) {
            console.log(err);
            sendError(msg, unknownError);
        }
    })
        .catch(console.log);
}
function checkChannel(channel) {
    if (channel.members.size < 1) {
        callHandler_1.deleteChannel(channel);
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

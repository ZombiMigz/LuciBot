"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customCallMessage = exports.initCustomCallHandler = void 0;
var bot_1 = require("../../bot");
var settingsHandler_1 = require("../settingsHandler");
var callHandler_1 = require("./callHandler");
var tutorialMsg = "To create your own channel, type ```.create [channelname]``` Make sure to join the channel in 15 seconds or it will delete itself. Have fun!";
var msgLengthError = "Your channel name was too long or too short. Please keep the name between 1-100 characters. :)";
var misunderstoodError = "Sorry, I didn't understand.";
var unknownError = "I did not understand the channel name. Please try again.";
var createCallText;
function initCustomCallHandler() {
    bot_1.client.channels
        .fetch(settingsHandler_1.createCallTextID)
        .then(function (res) {
        createCallText = res;
        createCallText.bulkDelete(100).catch(console.log);
        createCallText.send(tutorialMsg);
    })
        .catch(function (err) { return console.log("Failed to find call creation text channel"); });
}
exports.initCustomCallHandler = initCustomCallHandler;
function customCallMessage(msg) {
    if (settingsHandler_1.createCallTextID == msg.channel.id) {
        if (msg.content.split(" ")[0] == settingsHandler_1.prefix + "create") {
            var name_1 = msg.content.substr(8);
            if (name_1.length > 100 || name_1.length < 1) {
                sendError(msg, msgLengthError);
                return;
            }
            else {
                createChannel(msg, name_1);
                msg.delete();
            }
        }
        else {
            sendError(msg, misunderstoodError + " " + tutorialMsg);
        }
    }
}
exports.customCallMessage = customCallMessage;
function createChannel(msg, name) {
    bot_1.client.channels
        .fetch(settingsHandler_1.customCallCategoryID)
        .then(function (res) {
        var category = res;
        var guild = category.guild;
        try {
            guild.channels.create(name, { type: "voice" }).then(function (channel) {
                channel.setParent(category);
                setTimeout(function () {
                    checkChannel(channel);
                }, 10000);
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
    createCallText
        .send(error)
        .then(function (res) {
        res.delete({ timeout: 5000 });
    })
        .catch(console.log);
    msg.delete({ timeout: 5000 });
}

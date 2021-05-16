"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTempChannel = exports.initCallHandler = void 0;
var bot_1 = require("../../bot");
var customCallHandler_1 = require("./customCallHandler");
var fs_1 = require("fs");
var Discord = require('discord.js');
var names = bot_1.settings["Call Names"];
var channelIDs = bot_1.settings["Call IDs"];
var tempChannels = JSON.parse(fs_1.readFileSync('src/call/tempChannels.json').toString()).tempChannels;
function initCallHandler() {
    customCallHandler_1.initCustomCallHandler();
    bot_1.client.on('voiceStateUpdate', function (fromState, state) {
        handleJoin(fromState, state);
    });
}
exports.initCallHandler = initCallHandler;
// move to call handler later
var handleJoin = function (fromState, state) {
    if (state.channel != null &&
        state.channelID == channelIDs["Create Call Channel"]) {
        createChannel(state);
    }
    if (fromState.channel != undefined) {
        if (tempChannels.includes(fromState.channelID) && fromState.channel.members.size == 0) {
            tempChannels.splice(tempChannels.indexOf(fromState.channelID), 1);
            updateFile();
            fromState.channel.delete();
        }
    }
};
function createChannel(state) {
    var category = state.channel.parent;
    var user = state.member.user;
    var guild = state.guild;
    guild.channels.create(user.username.toString() + "'s " + generateName(), { type: 'voice' })
        .then(function (newChannel) {
        addTempChannel(newChannel.id);
        newChannel.setParent(category);
        state.member.voice.setChannel(newChannel);
    })
        .catch(console.log);
}
function addTempChannel(ID) {
    tempChannels.push(ID);
    updateFile();
}
exports.addTempChannel = addTempChannel;
function updateFile() {
    fs_1.writeFileSync("src/call/tempChannels.json", JSON.stringify({ "tempChannels": tempChannels }));
}
function generateName() {
    var list = names;
    return list[Math.floor(Math.random() * list.length)];
}

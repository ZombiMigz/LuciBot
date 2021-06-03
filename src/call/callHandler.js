"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTempChannel = exports.deleteChannel = exports.initCallHandler = void 0;
var bot_1 = require("../../bot");
var customCallHandler_1 = require("./customCallHandler");
var fs_1 = require("fs");
var settingsHandler_1 = require("../settingsHandler");
require("fs");
var tempChannels;
function initCallHandler() {
    loadTempChannelsFile();
    customCallHandler_1.initCustomCallHandler();
    bot_1.client.on('voiceStateUpdate', function (fromState, state) {
        handleJoin(fromState, state);
    });
}
exports.initCallHandler = initCallHandler;
function loadTempChannelsFile() {
    console.log("Attempting to load tempchannels file");
    var filePath = 'src/call/tempChannels.json';
    fs_1.access(filePath, fs_1.constants.W_OK, function (err) {
        if (err) {
            console.log(filePath + " does not exist or is not read/writable.\n" + err);
            console.log("creating new file");
            tempChannels = [];
        }
        else {
            console.log("Loaded tempchannels file. Now reading tempchannels file");
            tempChannels = JSON.parse(fs_1.readFileSync(filePath).toString()).tempChannels;
        }
    });
}
// move to call handler later
function handleJoin(fromState, state) {
    if (state.channel != null &&
        state.channelID == settingsHandler_1.createCallVoiceID) {
        createChannel(state);
    }
    if (fromState.channel != undefined) {
        if (tempChannels.includes(fromState.channelID) && fromState.channel.members.size == 0) {
            tempChannels.splice(tempChannels.indexOf(fromState.channelID), 1);
            updateFile();
            deleteChannel(fromState.channel);
        }
    }
}
function deleteChannel(channel) {
    channel.delete().catch(function (err) {
        console.log("Error deleting channel \n" + err);
    });
}
exports.deleteChannel = deleteChannel;
function createChannel(state) {
    var category = state.channel.parent;
    var user = state.member.user;
    var guild = state.guild;
    console.log("creating new temp channel");
    guild.channels.create(user.username.toString() + "'s " + generateName(), { type: 'voice' })
        .then(function (newChannel) {
        console.log("created new temp channel " + newChannel.name + " successfully");
        addTempChannel(newChannel.id);
        newChannel.setParent(category);
        state.member.voice.setChannel(newChannel);
        console.log("temp channels successfully setup");
    })
        .catch(console.log);
}
function addTempChannel(ID) {
    tempChannels.push(ID);
    updateFile();
}
exports.addTempChannel = addTempChannel;
function updateFile() {
    console.log("writing to tempchannels file");
    fs_1.writeFile("src/call/tempChannels.json", JSON.stringify({ "tempChannels": tempChannels }), function (err) {
        if (err)
            console.log("Failed writing to tempChannels " + tempChannels);
    });
}
function generateName() {
    var list = settingsHandler_1.customCallNames;
    return list[Math.floor(Math.random() * list.length)];
}

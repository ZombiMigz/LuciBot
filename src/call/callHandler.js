"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addTempChannel = exports.deleteChannel = exports.initCallHandler = void 0;
var bot_1 = require("../../bot");
var customCallHandler_1 = require("./customCallHandler");
var fs_1 = require("fs");
var settingsHandler_1 = require("../settingsHandler");
require("fs");
var tempChannelsTemplate = { "tempChannels": [] };
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
    var filePath = 'src/call/tempChannels.json';
    fs_1.access(filePath, fs_1.constants.W_OK, function (err) {
        if (err) {
            console.log("/src/call/tempChannels.json does not exist or is not read/writable.\n" + err);
            try {
                console.log("Attempting to create new tempChannels file");
                fs_1.writeFile('src/call/tempChannels.json', '', function (err) {
                    console.log("Created new tempChannels file");
                });
                updateFile();
            }
            catch (e) {
                console.log("Failed to create new tempChannels file.\n" + e);
                bot_1.client.destroy();
            }
        }
        else {
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
    var list = settingsHandler_1.customCallNames;
    return list[Math.floor(Math.random() * list.length)];
}

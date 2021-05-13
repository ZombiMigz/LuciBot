"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var bot_1 = require("../../bot");
var Discord = require('discord.js');
var names = require('../call/callNames.json');
var channelList = require('../channelIDs.json');
var tempChannels = [];
function init() {
    bot_1.client.on('voiceStateUpdate', function (fromState, state) {
        handleJoin(fromState, state);
    });
}
// move to call handler later
var handleJoin = function (fromState, state) {
    if (state.channel != null &&
        state.channelID == channelList["Create Call Channel"]) {
        createChannel(state);
    }
    if (fromState.channel != undefined) {
        if (tempChannels.includes(fromState.channelID) && fromState.channel.members.size == 0) {
            tempChannels.splice(tempChannels.indexOf(fromState.channelID), 1);
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
        tempChannels.push(newChannel.id);
        newChannel.setParent(category);
        state.member.voice.setChannel(newChannel);
    })
        .catch(console.log);
}
function generateName() {
    var list = names.list;
    return list[Math.floor(Math.random() * list.length)];
}
module.exports = {
    name: 'callHandler',
    init: init
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require('discord.js');
var tempChannels = [];
// move to call handler later
var handleJoin = function (fromState, state) {
    if (state.channel != null && state.channel.name == "Create Call") {
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
    guild.channels.create(user.username.toString() + "'s Private Channel", { type: 'voice' })
        .then(function (newChannel) {
        tempChannels.push(newChannel.id);
        newChannel.setParent(category);
        state.member.voice.setChannel(newChannel);
    })
        .catch(console.log);
}
module.exports = handleJoin;

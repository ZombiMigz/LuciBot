"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require('discord.js');
var bot = new Discord.Client();
var tempChannels;
bot.on('voiceStateUpdate', function (fromState, state) {
    console.log(state.channel.toString());
    if (state.channel.toString() == "Create Call") {
        createChannel(state);
    }
    if (tempChannels.includes(fromState.channel)) {
        if (fromState.channel.members.size == 0) {
            fromState.channel.delete();
        }
    }
});
function createChannel(state) {
    var category = state.channel.parent;
    var user = state.member.user;
    var guild = state.guild;
    guild.channels.create(user.username.toString() + "'s Private Channel", { type: 'voice' })
        .then(function (newChannel) {
        tempChannels.push(newChannel);
    })
        .catch(console.log);
}

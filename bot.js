"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Discord = require('discord.js');
var bot = new Discord.Client();
var token = 'NjcxMDkwMjE5ODUxODQxNTM3.Xi33eA.14eswi11TKXGpO53cwagp96nBHo';
// const database = require('./database');
// const quotesHandler = require('./src/quotes/Handler');
var prefix = '.';
bot.on('ready', function () {
    console.log('LuciBot Online and listening at prefix: ' + prefix);
    // database.init();
    // quotesHandler.init();
});
var tempChannels = [];
// move to call handler later
bot.on('voiceStateUpdate', function (fromState, state) {
    if (state.channel != null && state.channel.name == "Create Call") {
        createChannel(state);
    }
    if (fromState.channel != undefined) {
        if (tempChannels.includes(fromState.channelID) && fromState.channel.members.size == 0) {
            tempChannels.splice(tempChannels.indexOf(fromState.channelID), 1);
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
        tempChannels.push(newChannel.id);
        newChannel.setParent(category);
        state.member.voice.setChannel(newChannel);
    })
        .catch(console.log);
}
/*
bot.on('message', msg => {
    if (msg.content.startsWith("spam ")) {
        user = msg.mentions.users.first().toString();
        for (i = 0; i < 10; i++) ping(msg.channel, user);
    }
})
function ping(channel, user) {
    channel.send(`${user}`)
    .then()
    .catch(console.error);
}
*/
module.exports = bot;
bot.login(token);

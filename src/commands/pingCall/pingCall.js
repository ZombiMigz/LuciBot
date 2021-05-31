"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pingCall = void 0;
var bot_1 = require("../../../bot");
var settingsHandler_1 = require("../../settingsHandler");
var misunderstood = "I didn't understand. To use the spam call command please type ```" + settingsHandler_1.prefix + "pingcall<pc> <@user>```";
var notConnected = "The user you selected is not in a voice channel";
function pingCall(msg) {
    var content = msg.content.split(' ');
    if (msg.mentions.members.size == 0) {
        sendError(msg, misunderstood);
        return;
    }
    // id length is 18
    var id = content[1].substring(3, 21);
    var user;
    bot_1.client.users.fetch(id).then(function (res) {
        user = res;
        // gets member and channel
        var member;
        member = msg.guild.member(user);
        var voiceChannel = member.voice.channel;
        //checks call
        if (member.voice.channelID == null) {
            sendError(msg, notConnected);
            return;
        }
        // sends ping
        var message = '';
        voiceChannel.members.forEach(function (member) {
            message += "<@" + member.user.id + ">";
        });
        msg.channel.send(message, { split: true });
    }).catch(function (err) {
        console.log(err);
        sendError(msg, misunderstood);
        return;
    });
}
exports.pingCall = pingCall;
function sendError(msg, str) {
    msg.channel.send(str);
}

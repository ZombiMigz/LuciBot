import { CategoryChannel, Guild, TextChannel, User, VoiceChannel, VoiceState } from "discord.js";
import { client } from "../../bot";

const Discord = require('discord.js');
const names = require('../call/callNames.json');
const channelList = require('../channelIDs.json');

let tempChannels: string[] = [];
function init() {
    client.on('voiceStateUpdate', (fromState: VoiceState, state: VoiceState) => {
        handleJoin(fromState, state);
    })
}
// move to call handler later
let handleJoin = (fromState: VoiceState, state: VoiceState) => {
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
    
}
function createChannel(state: VoiceState) {
    let category: CategoryChannel = state.channel.parent;
    let user: User = state.member.user;
    let guild: Guild = state.guild;
    
    guild.channels.create(
        `${user.username.toString()}'s ${generateName()}`,
         {type: 'voice'})
        .then(newChannel => {
            tempChannels.push(newChannel.id);
            newChannel.setParent(category);
            state.member.voice.setChannel(newChannel);
        })
        .catch(console.log);   
}

function generateName() : String {
    let list: String[] = names.list;
    return list[Math.floor(Math.random() * list.length)];
}


module.exports = {
    name: 'callHandler',
    init: init
};
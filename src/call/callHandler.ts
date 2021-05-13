import { CategoryChannel, Guild, TextChannel, User, VoiceChannel, VoiceState } from "discord.js";
import { client } from "../../bot";

const Discord = require('discord.js')


let tempChannels: string[] = [];
// move to call handler later
let handleJoin = (fromState: VoiceState, state: VoiceState) => {
    if (state.channel != null && state.channel.name == "Create Call") {
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
    
    guild.channels.create(`${user.username.toString()}'s Private Channel`, {type: 'voice'})
        .then(newChannel => {
            tempChannels.push(newChannel.id);
            newChannel.setParent(category);
            state.member.voice.setChannel(newChannel);
        })
        .catch(console.log);
    
}

module.exports = handleJoin;
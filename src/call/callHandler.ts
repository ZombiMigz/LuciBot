import { CategoryChannel, Guild, TextChannel, User, VoiceChannel, VoiceState } from "discord.js";

const Discord = require('discord.js')
const bot = new Discord.Client();

let tempChannels : VoiceChannel[];
bot.on('voiceStateUpdate', (fromState: VoiceState, state: VoiceState) => {
    console.log(state.channel.toString());
    if (state.channel.toString() == "Create Call") {
        createChannel(state);
    }
    if (tempChannels.includes(fromState.channel)) {
        if (fromState.channel.members.size == 0) {
            fromState.channel.delete();
        }
    }
})

function createChannel(state: VoiceState) {
    let category: CategoryChannel = state.channel.parent;
    let user: User = state.member.user;
    let guild: Guild = state.guild;
    
    guild.channels.create(`${user.username.toString()}'s Private Channel`, {type: 'voice'})
        .then(newChannel => {
            tempChannels.push(newChannel);
        })
        .catch(console.log);
}



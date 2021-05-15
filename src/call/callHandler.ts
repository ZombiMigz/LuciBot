import { CategoryChannel, Guild, TextChannel, User, VoiceChannel, VoiceState } from "discord.js";
import { client } from "../../bot";
import { initCustomCallHandler } from "./customCallHandler";
import { readFileSync, writeFileSync} from "fs";


const Discord = require('discord.js');
const names = require('../call/callNames.json');
const channelList = require('../channelIDs.json');


let tempChannels: string[] = JSON.parse(readFileSync('src/call/tempChannels.json').toString()).tempChannels;
export function initCallHandler() {
    initCustomCallHandler();
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
            updateFile();
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
            addTempChannel(newChannel.id);
            newChannel.setParent(category);
            state.member.voice.setChannel(newChannel);
        })
        .catch(console.log);   
}

export function addTempChannel(ID: string) {
    tempChannels.push(ID);
    updateFile();
}

function updateFile() {
    writeFileSync("src/call/tempChannels.json", JSON.stringify({"tempChannels": tempChannels }))
}

function generateName() : String {
    let list: String[] = names.list;
    return list[Math.floor(Math.random() * list.length)];
}

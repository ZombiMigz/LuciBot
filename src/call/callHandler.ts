import { CategoryChannel, Guild, TextChannel, User, VoiceChannel, VoiceState } from "discord.js";
import { client} from "../../bot";
import { initCustomCallHandler } from "./customCallHandler";
import { access, constants, fstat, readFileSync, writeFile, writeFileSync} from "fs";
import { createCallVoiceID, customCallNames } from "../settingsHandler";
import "fs";
import { Interface } from "readline";


let tempChannels:string[];


export function initCallHandler() {
    loadTempChannelsFile();
    initCustomCallHandler();
    client.on('voiceStateUpdate', (fromState: VoiceState, state: VoiceState) => {
        handleJoin(fromState, state);
    })
}

function loadTempChannelsFile() {
    let filePath: string = 'src/call/tempChannels.json';
    access(filePath, constants.W_OK, err => {
        if (err) {
            console.log(`${filePath} does not exist or is not read/writable.\n${err}`);
            console.log(`creating new file`);
            tempChannels = [];
        } else {
            tempChannels = JSON.parse(readFileSync(filePath).toString()).tempChannels;
        }
 
    })
    
}


// move to call handler later
function handleJoin (fromState: VoiceState, state: VoiceState) {
    if (state.channel != null && 
        state.channelID == createCallVoiceID) {
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

export function deleteChannel(channel: VoiceChannel) {
    channel.delete().catch(err => {
        console.log(`Error deleting channel \n${err}`)
    })
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
    try {
        writeFileSync("src/call/tempChannels.json", JSON.stringify({"tempChannels": tempChannels }))
    } catch (err) {
        console.log(`Failed to save tempChannels file: ${err}`);
    }
    
}

function generateName() : String {
    let list: String[] = customCallNames;
    return list[Math.floor(Math.random() * list.length)];
}

import { CategoryChannel, Guild, TextChannel, User, VoiceChannel, VoiceState } from "discord.js";
import { client} from "../../bot";
import { initCustomCallHandler } from "./customCallHandler";
import { access, constants, readFileSync, writeFile} from "fs";
import { createCallVoiceID, customCallNames } from "../settingsHandler";
import "fs";

let tempChannels:string[];

export function initCallHandler() {
    loadTempChannelsFile();
    initCustomCallHandler();
    client.on('voiceStateUpdate', (fromState: VoiceState, state: VoiceState) => {
        handleJoin(fromState, state);
    })
}

function loadTempChannelsFile() {
    console.log("Attempting to load tempchannels file");
    let filePath: string = 'src/call/tempChannels.json';
    access(filePath, constants.W_OK, err => {
        if (err) {
            console.log(`${filePath} does not exist or is not read/writable.\n${err}`);
            console.log(`creating new file`);
            tempChannels = [];
        } else {
            console.log("Loaded tempchannels file. Now reading tempchannels file")
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
    
    console.log(`creating new temp channel`);
    guild.channels.create(
        `${user.username.toString()}'s ${generateName()}`,
         {type: 'voice'})
        .then(newChannel => {
            console.log(`created new temp channel ${newChannel.name} successfully`);
            addTempChannel(newChannel.id);
            newChannel.setParent(category);
            state.member.voice.setChannel(newChannel);
            console.log("temp channels successfully setup");
        })
        .catch(console.log);   
}

export function addTempChannel(ID: string) {
    tempChannels.push(ID);
    updateFile();
}

function updateFile() {
    console.log("writing to tempchannels file");
    writeFile("src/call/tempChannels.json", JSON.stringify({"tempChannels": tempChannels }), err => {
        if (err) 
            console.log(`Failed writing to tempChannels ${tempChannels}`);
    })
}

function generateName() : String {
    let list: String[] = customCallNames;
    return list[Math.floor(Math.random() * list.length)];
}

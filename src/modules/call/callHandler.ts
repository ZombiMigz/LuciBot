import { VoiceBasedChannel } from "./../../../node_modules/discord.js/typings/index.d";
import { CategoryChannel, Guild, User, VoiceChannel, VoiceState } from "discord.js";

import { initCustomCallHandler } from "./customCallHandler";
import { access, constants, readFileSync, writeFile } from "fs";
import { settings } from "../../settingsHandler";
let { voiceCreateID, names } = settings.customCallsModule;
import "fs";
import { client } from "../../../bot";

let tempChannels: string[];

export function initCallHandler() {
  // if (!settings.customCallsModule.enabled) return;
  loadTempChannelsFile();
  initCustomCallHandler();
  client.on("voiceStateUpdate", (fromState: VoiceState, state: VoiceState) => {
    handleJoin(fromState, state);
  });
}

function loadTempChannelsFile() {
  console.log("Attempting to load tempchannels file");
  let filePath: string = "src/modules/call/tempChannels.json";
  access(filePath, constants.W_OK, (err) => {
    if (err) {
      console.log(`${filePath} does not exist or is not read/writable.\n${err}`);
      console.log(`creating new file`);
      tempChannels = [];
    } else {
      console.log("Loaded tempchannels file. Now reading tempchannels file");
      tempChannels = JSON.parse(readFileSync(filePath).toString()).tempChannels;
    }
  });
}
// move to call handler later
function handleJoin(fromState: VoiceState, state: VoiceState) {
  if (state.channel != null && state.channelId == voiceCreateID) {
    createChannel(state);
  }

  if (fromState.channel != undefined) {
    if (tempChannels.includes(fromState.channelId) && fromState.channel.members.size == 0) {
      tempChannels.splice(tempChannels.indexOf(fromState.channelId), 1);
      updateFile();
      deleteChannel(fromState.channel);
    }
  }
}

export function deleteChannel(channel: VoiceBasedChannel) {
  channel.delete().catch((err: string) => {
    console.log(`Error deleting channel \n${err}`);
  });
}

function createChannel(state: VoiceState) {
  let category: CategoryChannel = state.channel.parent;
  let user: User = state.member.user;
  let guild: Guild = state.guild;

  console.log(`creating new temp channel`);
  guild.channels
    .create(`${user.username.toString()}'s ${generateName()}`, {
      type: "GUILD_VOICE",
    })
    .then((newChannel: VoiceChannel) => {
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
  writeFile("src/call/tempChannels.json", JSON.stringify({ tempChannels: tempChannels }), (err) => {
    if (err) console.log(`Failed writing to tempChannels ${tempChannels}`);
  });
}

function generateName(): String {
  let list: String[] = names;
  return list[Math.floor(Math.random() * list.length)];
}

import { TextChannel, VoiceChannel } from "discord.js";
import { Settings } from "./settings_template";

export const settings: Settings = require("./settings");

export const token: string = settings.Token;
export const prefix: string = settings.Prefix;

export const customCallNames: String[] = settings["Custom Call Names"];

//channel ID list
let channelIDs = settings["Channel IDs"];
export const debugChannelID = channelIDs.Debug;
export const AFKChannelID = channelIDs.AFK;
export const createCallTextID = channelIDs["Create Call Text"];
export const createCallVoiceID = channelIDs["Create Call Voice"];
export const customCallCategoryID = channelIDs["Custom Call Category"];

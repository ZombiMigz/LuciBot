import fs from 'fs';

import { emptySettings, Settings } from './settings_template';

export let settings: Settings;

//tries to write settings file if it doesn't exist
try {
  fs.writeFileSync("./src/settings.json", JSON.stringify(emptySettings, null, "\t"), { flag: "wx" });
  console.log("Created new settings file, update channel and role IDs");
} catch {
  console.log("Found settings file");
}

try {
  settings = JSON.parse(fs.readFileSync("./src/settings.json").toString());
  console.log(settings);
} catch (e) {
  console.log("Could not read settings file,  possibly corrupted: ", e);
}

export const token: string = settings.Token;
export const prefix: string = settings.Prefix;

export const customCallNames: String[] = settings["Custom Call Names"];

//channel ID list
let channelIDs = settings["Channel IDs"];
export const debugChannelID = channelIDs.Debug;
export const AFKChannelID = channelIDs.AFK;
export const announcements = channelIDs["Announcements Text"];
export const createCallTextID = channelIDs["Create Call Text"];
export const createCallVoiceID = channelIDs["Create Call Voice"];
export const customCallCategoryID = channelIDs["Custom Call Category"];

//Birthday
export const birthdayRole = settings.Birthday["Birthday Role"];

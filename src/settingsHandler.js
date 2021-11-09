"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.birthdayRole = exports.customCallCategoryID = exports.createCallVoiceID = exports.createCallTextID = exports.announcements = exports.AFKChannelID = exports.debugChannelID = exports.customCallNames = exports.prefix = exports.token = exports.settings = void 0;
var fs_1 = __importDefault(require("fs"));
var settings_template_1 = require("./settings_template");
//tries to write settings file if it doesn't exist
try {
    fs_1.default.writeFileSync("./src/settings.json", JSON.stringify(settings_template_1.emptySettings, null, "\t"), { flag: "wx" });
    console.log("Created new settings file, update channel and role IDs");
}
catch (_a) {
    console.log("Found settings file");
}
try {
    exports.settings = JSON.parse(fs_1.default.readFileSync("./src/settings.json").toString());
    console.log(exports.settings);
}
catch (e) {
    console.log("Could not read settings file,  possibly corrupted: ", e);
}
exports.token = exports.settings.Token;
exports.prefix = exports.settings.Prefix;
exports.customCallNames = exports.settings["Custom Call Names"];
//channel ID list
var channelIDs = exports.settings["Channel IDs"];
exports.debugChannelID = channelIDs.Debug;
exports.AFKChannelID = channelIDs.AFK;
exports.announcements = channelIDs["Announcements Text"];
exports.createCallTextID = channelIDs["Create Call Text"];
exports.createCallVoiceID = channelIDs["Create Call Voice"];
exports.customCallCategoryID = channelIDs["Custom Call Category"];
//Birthday
exports.birthdayRole = exports.settings.Birthday["Birthday Role"];

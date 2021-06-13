"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.birthdayRole = exports.customCallCategoryID = exports.createCallVoiceID = exports.createCallTextID = exports.announcements = exports.AFKChannelID = exports.debugChannelID = exports.customCallNames = exports.prefix = exports.token = exports.settings = void 0;
exports.settings = require("./settings");
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

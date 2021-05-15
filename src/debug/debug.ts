import { TextChannel } from "discord.js";
import { client } from "../../bot";

const channelList = require('../channelIDs.json');

let debugChannel: TextChannel;
export function initDebugger() {
    client.channels.fetch(<string> channelList["Debug Channel"]).then(channel => {
        debugChannel = <TextChannel> channel;
        debugChannel.send("Successfully connected to debug channel");
    });
}
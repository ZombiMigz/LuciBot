import { TextChannel } from "discord.js";
import { client, settings } from "../../bot";

const channelID: string = <string> settings["Call IDs"]["Debug Channel"];

let debugChannel: TextChannel;
export function initDebugger() {
    client.channels.fetch(channelID).then(channel => {
        debugChannel = <TextChannel> channel;
        debugChannel.send("Successfully connected to debug channel");
    });
}
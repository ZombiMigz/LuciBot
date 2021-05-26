import { Message, TextChannel } from "discord.js";
import { client } from "../../bot";
import { debugChannelID } from "../settingsHandler";


let debugChannel: TextChannel;
export function initDebugger() {
    client.channels.fetch(debugChannelID).then(channel => {
        debugChannel = <TextChannel> channel;
        debugChannel.send("Successfully connected to debug channel");
    });
    pingListener();
}

function pingListener() {
    client.on('message', (msg: Message) => {
        if (msg.channel.id == debugChannel.id && msg.content.startsWith("ping")) {
            debugChannel.send(`Time between send and receive: ${new Date().getTime() - msg.createdAt.getTime()} ms`);
        }
    })
}
import { Message, TextChannel } from "discord.js";
import { client } from "../../bot";
import { settings } from "../settingsHandler";

let debugChannel: TextChannel;
export function initDebugger() {
  client.channels.fetch(settings.channelIDs.debug).then((channel) => {
    debugChannel = <TextChannel>channel;
    debugChannel.send("Successfully connected to debug channel");
  });
  pingListener();
}

function pingListener() {
  client.on("messageCreate", (msg: Message) => {
    if (msg.channel.id == debugChannel.id && msg.content.startsWith("ping")) {
      let timeSent: number = new Date().getTime();
      debugChannel.send(`Time to register msg: ${timeSent - msg.createdAt.getTime()} ms`).then((msg) => {
        debugChannel.send(`Time to send msg: ${msg.createdTimestamp - timeSent}`);
      });
    }
  });
}

import { client } from "../../bot";
import { customCallMessage } from "../call/customCallHandler";
import { createCallTextID, prefix } from "../settingsHandler";



export function initCommandHandler() {
    client.on('message', msg => {
        if (!msg.content.startsWith(prefix)) return;
        if (msg.author.bot) return;
        if (createCallTextID == msg.channel.id) customCallMessage(msg);
    })
}
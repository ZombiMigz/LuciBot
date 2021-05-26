import { client, prefix, settings } from "../../bot";
import { customCallMessage } from "../call/customCallHandler";



export function initCommandHandler() {
    client.on('message', msg => {
        if (!msg.content.startsWith(prefix)) return;
        if (msg.author.bot) return;
        if (settings["Call IDs"]["Custom Call Creator"] == msg.channel.id) customCallMessage(msg);
    })
}
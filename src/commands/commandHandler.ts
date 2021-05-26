import { client } from "../../bot";
import { customCallMessage } from "../call/customCallHandler";
import { createCallTextID, prefix } from "../settingsHandler";
import { spam } from "./misc/spamCommand";



export function initCommandHandler() {
    client.on('message', msg => {
        if (!msg.content.startsWith(prefix)) return;
        if (msg.author.bot) return;

        //special case with custom calls
        if (createCallTextID == msg.channel.id) customCallMessage(msg);

        //any channel
        msg.content = msg.content.substring(prefix.length);
        if (msg.content.split(' ')[0] == "spam") spam(msg);


        //must be in lucibot channel
    })
}
import { client } from "../../bot";
import { bDayCommand } from "../birthday/birthdayHandler";
import { customCallMessage } from "../call/customCallHandler";
import { createCallTextID, prefix } from "../settingsHandler";
import { spam } from "./misc/spamCommand";
import { pingCall } from "./pingCall/pingCall";



export function initCommandHandler() {
    client.on('message', msg => {
        if (!msg.content.startsWith(prefix)) return;
        if (msg.author.bot) return;

        //special case with custom calls
        if (createCallTextID == msg.channel.id) customCallMessage(msg);

        //any channel
        // removes prefix
        msg.content = msg.content.substring(prefix.length);
        let key: string = msg.content.split(' ')[0];
        if (key == "spam") spam(msg);
        if (key == "pingcall" || key == "pc") pingCall(msg);
        if (key == "birthday") bDayCommand(msg);
        //must be in lucibot channel
    })
}
import { client } from "../../bot";
import { bDayCommand } from "../modules/birthday/birthdayHandler";
import { customCallMessage } from "../modules/call/customCallHandler";
import { settings } from "../settingsHandler";
import { spam } from "./misc/spamCommand";
import { pingCall } from "./pingCall/pingCall";

export function initCommandHandler() {
  client.on("messageCreate", (msg) => {
    if (!msg.content.startsWith(settings.prefix)) return;
    if (msg.author.bot) return;

    //special case with custom calls
    if (settings.customCallsModule.textCreateID == msg.channel.id) customCallMessage(msg);

    //any channel
    // removes prefix
    msg.content = msg.content.substring(settings.prefix.length);
    let key: string = msg.content.split(" ")[0];
    if (key == "spam") spam(msg);
    if (key == "pingcall" || key == "pc") pingCall(msg);
    if (key == "birthday") bDayCommand(msg);
    //must be in lucibot channel
  });
}

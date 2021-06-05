import { Message } from "discord.js";
import { client } from "../../bot";
import { prefix } from "../settingsHandler";
import { getBDay, initBDayStorage } from "./birthdayStorage";

export function initBDayHandler() {
    initBDayStorage();
}

export function bDayCommand(msg: Message) {
    let content:string[] = msg.content.split(' ');
    if (content[1] == 'get') {
        getBDay(msg.mentions.members.first().id);
    } else {
        sendError(msg, "I didn't understand. To use the birthday command type "+ prefix +"birthday <get/today>")
    }
}

function sendError(msg: Message, err: string) {
    msg.channel.send(err);
}

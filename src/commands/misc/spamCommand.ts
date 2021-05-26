import { Message } from "discord.js";

let misunderstood: string = "Sorry I didn't understand. To use the spam command type ```.spam <1-5> <@user> <message>```"
export function spam(msg: Message) {
    msg.content = msg.content.substring(5);
    let content:string[] = msg.content.split(' ');
    let num = Number(content[0]);
    if (num != NaN && num > 0 && num <= 5) {
        for (let i = 0; i < num; i++) {
            msg.channel.send(msg.content.substring(2));
        }
    } else {
        error(msg, misunderstood);
    }
}

function error(msg: Message, err: string) {
    msg.channel.send(err);
}
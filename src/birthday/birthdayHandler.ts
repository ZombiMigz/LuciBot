import { Message } from 'discord.js';

import { prefix } from '../settingsHandler';
import { getBDay, initBDayStorage, setBDay } from './birthdayStorage';

export function initBDayHandler() {
  initBDayStorage();
}

export function bDayCommand(msg: Message) {
  let content: string[] = msg.content.split(" ");
  if (content[1] == "get") {
    if (msg.mentions.members == null || msg.mentions.members.size < 1) {
      sendError(
        msg,
        "I didn't understand. To get birthdays type ```" +
          prefix +
          "birthday get <@user>```"
      );
    } else {
      msg.channel.send(convertBDay(getBDay(msg.mentions.members.first().id)));
    }
  } else if (content[1] == "set") {
    let date = content[2];
    if (
      content[2].length < 4 ||
      Number.isNaN(date.substring(0, 2)) ||
      date[2] != "/" ||
      Number.isNaN(date.substring(3, 5))
    ) {
      sendError(
        msg,
        "I didn't understand. To set birthdays type ```" +
          prefix +
          "birthday set mm/dd```"
      );
    } else if (
      Number.parseInt(date.substring(0, 2)) > 12 ||
      Number.parseInt(date.substring(3, 5)) > 31
    ) {
      sendError(msg, "Invalid date");
    } else {
      setBDay(msg.member.id, date.substring(0, 2) + date.substring(3, 5));
      msg.channel.send(
        `Birthday set to: ${convertBDay(getBDay(msg.member.id))}`
      );
    }
  } else {
    sendError(
      msg,
      "I didn't understand. To use the birthday command type ```" +
        prefix +
        "birthday <get/set/today>```"
    );
  }
}

function convertBDay(data: string): string {
  return `Month: ${data.substring(0, 2)} Day: ${data.substring(2)}`;
}

function sendError(msg: Message, err: string) {
  msg.channel.send(err);
}

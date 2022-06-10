import { GuildMember, Message, TextChannel } from "discord.js";

import { client } from "../../../bot";
import { settings } from "../../settingsHandler";

import { getBDay } from "./birthdayStorage";

export function initBDayRoleHandler() {
  client.on("message", (msg: Message) => {
    try {
      if (!msg.author.bot && msg.member.id != "234390474268344321") {
        checkBirthday(msg.member);
      }
    } catch (err) {
      console.log(`processing msg in birthday role handler:\nMessage: ${msg}\nError: ${err}`);
    }
  });

  //checks for birthday of all members on startup
  // client.on("ready", () => {
  //   client.guilds.cache.forEach((guild) => {
  //     guild.members.cache.forEach(member => {
  //       checkBirthday(member);
  //     });
  //   });
  // });
}

function checkBirthday(member: GuildMember) {
  let birthdayRoleID = settings.birthdayModule.roleID;
  let { announcements } = settings.channelIDs;

  if (member.roles.cache.some((role) => role.id == birthdayRoleID)) {
    if (!isToday(getBDay(member.id))) {
      member.roles.remove(birthdayRoleID);
    }
  } else {
    if (isToday(getBDay(member.id))) {
      (<TextChannel>member.guild.channels.cache.get(announcements)).send(
        `EVERYONE WISH A HAPPY BIRTHDAY TO <@${member.id}>`
      );

      member.roles.add(birthdayRoleID);
    }
  }
}

function isToday(date: string): boolean {
  let now: Date = new Date();
  return now.getMonth() + 1 == parseInt(date.substring(0, 2)) && now.getDate() == parseInt(date.substring(2, 4));
}

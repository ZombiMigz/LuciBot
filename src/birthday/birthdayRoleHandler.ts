import { GuildMember, Message, TextChannel } from 'discord.js';

import { client } from '../../bot';
import { announcements, birthdayRole } from '../settingsHandler';
import { getBDay } from './birthdayStorage';

export function initBDayRoleHandler() {
  client.on("message", (msg: Message) => {
    checkBirthday(msg.member);
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
  if (member.roles.cache.some((role) => role.id == birthdayRole)) {
    if (!isToday(getBDay(member.id))) {
      member.roles.remove(birthdayRole);
    }
  } else {
    if (isToday(getBDay(member.id))) {
      (<TextChannel>member.guild.channels.cache.get(announcements)).send(
        `EVERYONE WISH A HAPPY BIRTHDAY TO <@${member.id}>`
      );

      member.roles.add(birthdayRole);
    }
  }
}

function isToday(date: string): boolean {
  let now: Date = new Date();
  return (
    now.getMonth() + 1 == parseInt(date.substring(0, 2)) &&
    now.getDate() == parseInt(date.substring(2, 4))
  );
}

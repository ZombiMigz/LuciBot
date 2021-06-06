import {
  GuildMember,
  Message,
  TextChannel,
  User,
  VoiceChannel,
} from "discord.js";
import { client } from "../../../bot";
import { prefix } from "../../settingsHandler";

let misunderstood: string =
  "I didn't understand. To use the spam call command please type ```" +
  prefix +
  "pingcall<pc> <@user>```";
let notConnected: string = "The user you selected is not in a voice channel";

export function pingCall(msg: Message) {
  let content: string[] = msg.content.split(" ");
  if (msg.mentions.members.size == 0) {
    sendError(msg, misunderstood);
    return;
  }

  let id: string = msg.mentions.members.first().id;
  let user: User;
  client.users
    .fetch(id)
    .then((res) => {
      user = res;

      // gets member and channel
      let member: GuildMember;
      member = msg.guild.member(user);
      let voiceChannel: VoiceChannel = member.voice.channel;

      //checks call
      if (member.voice.channelID == null) {
        sendError(msg, notConnected);
        return;
      }

      // sends ping
      let message: string = "";
      voiceChannel.members.forEach((member) => {
        message += `<@${member.user.id}>`;
      });
      msg.channel.send(message, { split: true });
    })
    .catch((err) => {
      console.log(err);
      sendError(msg, misunderstood);
      return;
    });
}

function sendError(msg: Message, str: string) {
  msg.channel.send(str);
}

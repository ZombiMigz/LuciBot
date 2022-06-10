import { GuildMember, Message, TextChannel, User, VoiceBasedChannel, VoiceChannel } from "discord.js";
import { client } from "../../../bot";
import { settings } from "../../settingsHandler";

let misunderstood: string =
  "I didn't understand. To use the spam call command please type ```" + settings.prefix + "pingcall<pc> <@user>```";
let notConnected: string = "The user you selected is not in a voice channel";

export async function pingCall(msg: Message) {
  let content: string[] = msg.content.split(" ");
  if (msg.mentions.members.size == 0) {
    sendError(msg, misunderstood);
    return;
  }

  let id: string = msg.mentions.members.first().id;

  try {
    let user = await client.users.fetch(id);

    // gets member and channel
    let member: GuildMember;
    member = await msg.guild.members.fetch(user);
    let voiceChannel: VoiceBasedChannel = member.voice.channel;

    //checks call
    if (member.voice.channelId == null) {
      sendError(msg, notConnected);
      return;
    }

    // sends ping
    let message: string = "";
    voiceChannel.members.forEach((member) => {
      message += `<@${member.user.id}>`;
    });
    msg.channel.send(message);
  } catch (err) {
    console.log(err);
    sendError(msg, misunderstood);
    return;
  }
}

function sendError(msg: Message, str: string) {
  msg.channel.send(str);
}

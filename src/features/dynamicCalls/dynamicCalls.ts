import { Channel, ChannelType, Client, GuildMember, GuildVoiceChannelResolvable, VoiceBasedChannel } from "discord.js";
import { ENV } from "../../env";
import { Feature } from "../Feature";

const CHANNEL_LEAVE_DELETE_DELAY_MS = 2000;

const trackedCallIds: Set<String> = new Set();

async function createCall(member: GuildMember) {
  const newChannel = (await member.guild.channels.create({
    type: ChannelType.GuildVoice,
    name: `${member.nickname ?? member.user.username}'s call`,
    parent: ENV.dynamicCallCategoryId,
  })) as VoiceBasedChannel;
  trackedCallIds.add(newChannel.id);
  member.voice.setChannel(newChannel).catch((err) => {
    console.log(`Unable to set voice channel for ${member.user.displayName}" ${err}`);
  });
  deleteCallIfEmpty(newChannel);
}

async function deleteCallIfEmpty(channel: VoiceBasedChannel) {
  await new Promise((res) => {
    setTimeout(() => res(null), CHANNEL_LEAVE_DELETE_DELAY_MS);
  });
  if (channel.members.size === 0) {
    trackedCallIds.delete(channel.id);
    channel.delete();
  }
}

function init(client: Client) {
  client.on("voiceStateUpdate", (oldState, newState) => {
    if (newState.channelId === ENV.dynamicCallCreateId && newState.member) {
      createCall(newState.member);
    }
    if (oldState.channel != null) {
      if (trackedCallIds.has(oldState.channelId ?? "") && oldState.channel?.members.size === 0) {
        deleteCallIfEmpty(oldState.channel);
      }
    }
  });
}

export const DynamicCallsModule = {
  init,
} satisfies Feature;

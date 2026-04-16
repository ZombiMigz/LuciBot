import { ChannelType, GuildMember, VoiceBasedChannel, VoiceState } from "discord.js";
import { DYNAMIC_CALL_CATEGORY_ID, DYNAMIC_CALL_CREATE_ID } from "@/src/env";

const CHANNEL_LEAVE_DELETE_DELAY_MS = 2000;

export interface DynamicCallsService {
  handleVoiceStateUpdate: (oldState: VoiceState, newState: VoiceState) => void;
}

export function createDynamicCallsService(
  categoryId: string,
  createChannelId: string
): DynamicCallsService {
  const trackedCallIds = new Set<string>();

  async function createCall(member: GuildMember) {
    const name = `${member.nickname ?? member.user.username}'s call`;
    const channel = (await member.guild.channels.create({
      type: ChannelType.GuildVoice,
      name,
      parent: categoryId,
    })) as VoiceBasedChannel;
    trackedCallIds.add(channel.id);
    await member.voice.setChannel(channel).catch((err) => {
      console.log(`Unable to set voice channel for ${member.user.displayName}: ${err}`);
    });
    deleteCallIfEmpty(channel);
  }

  async function deleteCallIfEmpty(channel: VoiceBasedChannel) {
    await new Promise((res) => setTimeout(res, CHANNEL_LEAVE_DELETE_DELAY_MS));
    if (channel.members.size === 0) {
      trackedCallIds.delete(channel.id);
      await channel.delete().catch((err) => {
        console.log(`Unable to delete voice channel with id ${channel.id}: ${err}`);
      });
    }
  }

  return {
    handleVoiceStateUpdate(oldState, newState) {
      if (newState.channelId === createChannelId && newState.member) {
        createCall(newState.member);
      }
      if (
        oldState.channel != null &&
        trackedCallIds.has(oldState.channelId ?? "") &&
        oldState.channel.members.size === 0
      ) {
        deleteCallIfEmpty(oldState.channel);
      }
    },
  };
}

export function createDynamicCallsServiceFromEnv(): DynamicCallsService {
  return createDynamicCallsService(DYNAMIC_CALL_CATEGORY_ID, DYNAMIC_CALL_CREATE_ID);
}

import { Collection, VoiceState } from "discord.js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DynamicCallsService,
  createDynamicCallsService,
} from "@/src/services/dynamicCalls/dynamicCallsService";

const CREATE_CHANNEL_ID = "create-channel-id";
const CATEGORY_ID = "category-id";

type FakeChannel = {
  id: string;
  members: Collection<string, object>;
  delete: ReturnType<typeof vi.fn>;
};

type FakeMember = {
  nickname: string | null;
  user: { username: string; displayName: string };
  guild: { channels: { create: ReturnType<typeof vi.fn> } };
  voice: { setChannel: ReturnType<typeof vi.fn> };
};

function makeChannel(id: string, memberCount = 0): FakeChannel {
  return {
    id,
    members: new Collection(
      Array.from({ length: memberCount }, (_, i) => [`member-${i}`, {}] as [string, object])
    ),
    delete: vi.fn().mockResolvedValue(undefined),
  };
}

function makeMember(opts: { nickname?: string; username?: string; channel?: FakeChannel } = {}): FakeMember {
  return {
    nickname: opts.nickname ?? null,
    user: { username: opts.username ?? "testuser", displayName: "TestUser" },
    guild: {
      channels: { create: vi.fn().mockResolvedValue(opts.channel ?? makeChannel("new-channel-id")) },
    },
    voice: { setChannel: vi.fn().mockResolvedValue(undefined) },
  };
}

function fakeVoiceState(
  channelId: string | null,
  channel: FakeChannel | null = null,
  member: FakeMember | null = null
): VoiceState {
  return { channelId, channel, member } as unknown as VoiceState;
}

describe("DynamicCallsService", () => {
  let service: DynamicCallsService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = createDynamicCallsService(CATEGORY_ID, CREATE_CHANNEL_ID);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("when a member joins the create channel", () => {
    it("creates a new voice channel named after the member's username", async () => {
      const member = makeMember({ username: "luciano" });
      service.handleVoiceStateUpdate(fakeVoiceState(null), fakeVoiceState(CREATE_CHANNEL_ID, null, member));
      await vi.runAllTimersAsync();
      expect(member.guild.channels.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "luciano's call" })
      );
    });

    it("uses nickname over username when available", async () => {
      const member = makeMember({ nickname: "LuciBot", username: "luciano" });
      service.handleVoiceStateUpdate(fakeVoiceState(null), fakeVoiceState(CREATE_CHANNEL_ID, null, member));
      await vi.runAllTimersAsync();
      expect(member.guild.channels.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: "LuciBot's call" })
      );
    });

    it("moves the member into the newly created channel", async () => {
      const newChannel = makeChannel("new-channel-id");
      const member = makeMember({ channel: newChannel });
      service.handleVoiceStateUpdate(fakeVoiceState(null), fakeVoiceState(CREATE_CHANNEL_ID, null, member));
      await vi.runAllTimersAsync();
      expect(member.voice.setChannel).toHaveBeenCalledWith(newChannel);
    });
  });

  describe("when a member leaves a tracked channel", () => {
    it("deletes the channel after the delay if it is empty", async () => {
      const newChannel = makeChannel("tracked-channel-id", 0);
      const member = makeMember({ channel: newChannel });

      service.handleVoiceStateUpdate(fakeVoiceState(null), fakeVoiceState(CREATE_CHANNEL_ID, null, member));
      await vi.runAllTimersAsync();

      service.handleVoiceStateUpdate(fakeVoiceState("tracked-channel-id", newChannel), fakeVoiceState(null));
      await vi.runAllTimersAsync();

      expect(newChannel.delete).toHaveBeenCalled();
    });

    it("does not delete the channel if members remain", async () => {
      const newChannel = makeChannel("tracked-channel-id", 1);
      const member = makeMember({ channel: newChannel });

      service.handleVoiceStateUpdate(fakeVoiceState(null), fakeVoiceState(CREATE_CHANNEL_ID, null, member));
      await vi.runAllTimersAsync();

      service.handleVoiceStateUpdate(fakeVoiceState("tracked-channel-id", newChannel), fakeVoiceState(null));
      await vi.runAllTimersAsync();

      expect(newChannel.delete).not.toHaveBeenCalled();
    });

    it("does not delete untracked channels", async () => {
      const untrackedChannel = makeChannel("untracked-channel-id", 0);
      service.handleVoiceStateUpdate(fakeVoiceState("untracked-channel-id", untrackedChannel), fakeVoiceState(null));
      await vi.runAllTimersAsync();
      expect(untrackedChannel.delete).not.toHaveBeenCalled();
    });
  });

  describe("when a member joins a non-create channel", () => {
    it("does not create a call", async () => {
      const member = makeMember();
      service.handleVoiceStateUpdate(fakeVoiceState(null), fakeVoiceState("some-other-channel-id", null, member));
      await vi.runAllTimersAsync();
      expect(member.guild.channels.create).not.toHaveBeenCalled();
    });
  });
});

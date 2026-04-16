import { beforeEach, describe, expect, it } from "vitest";
import { createMessageService } from "@/src/services/message/messageService";
import { makeFakeClient, makeFakeInteraction, makeFakeTextChannel } from "@/tests/utils";

describe("MessageService", () => {
  let client: ReturnType<typeof makeFakeClient>;
  let service: ReturnType<typeof createMessageService>;

  beforeEach(() => {
    client = makeFakeClient();
    service = createMessageService(client as never);
  });

  describe("sendMessage", () => {
    it("fetches the channel and sends the content", async () => {
      const channel = makeFakeTextChannel();
      client.channels.fetch.mockResolvedValue(channel);

      await service.sendMessage("channel-id", "hello");

      expect(client.channels.fetch).toHaveBeenCalledWith("channel-id");
      expect(channel.send).toHaveBeenCalledWith("hello");
    });

    it("throws if the channel is not a text channel", async () => {
      client.channels.fetch.mockResolvedValue({ id: "channel-id" });

      await expect(service.sendMessage("channel-id", "hello")).rejects.toThrow(
        "is not a text channel"
      );
    });
  });

  describe("command", () => {
    it("has the name 'msg'", () => {
      expect(service.command.builder.name).toBe("msg");
    });

    it("sends the message and replies ephemerally", async () => {
      const channel = makeFakeTextChannel();
      client.channels.fetch.mockResolvedValue(channel);

      const interaction = makeFakeInteraction("msg", {
        channel: { id: "channel-id" },
        message: "hello",
      });

      await service.command.handler(interaction as never);

      expect(channel.send).toHaveBeenCalledWith("hello");
      expect(interaction.reply).toHaveBeenCalledWith({ content: "Message sent!", ephemeral: true });
    });
  });
});

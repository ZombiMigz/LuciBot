import { TextChannel } from "discord.js";
import { vi } from "vitest";

type EventHandler = (...args: unknown[]) => unknown;

export type FakeClient = {
  channels: { fetch: ReturnType<typeof vi.fn> };
  on: ReturnType<typeof vi.fn>;
  triggerEvent: (event: string, ...args: unknown[]) => Promise<void>;
};

export function makeFakeClient(): FakeClient {
  const handlers: Record<string, EventHandler[]> = {};

  const on = vi.fn((event: string, handler: EventHandler) => {
    handlers[event] ??= [];
    handlers[event].push(handler);
  });

  return {
    channels: { fetch: vi.fn() },
    on,
    triggerEvent: async (event: string, ...args: unknown[]) => {
      for (const handler of handlers[event] ?? []) {
        await handler(...args);
      }
    },
  };
}

export function makeFakeTextChannel() {
  const channel = Object.create(TextChannel.prototype) as TextChannel;
  channel.send = vi.fn().mockResolvedValue(undefined);
  return channel;
}

export function makeFakeInteraction(commandName: string, options: Record<string, unknown> = {}) {
  return {
    isChatInputCommand: () => true,
    commandName,
    options: {
      getChannel: vi.fn((name: string) => options[name] ?? null),
      getString: vi.fn((name: string) => options[name] ?? null),
    },
    reply: vi.fn().mockResolvedValue(undefined),
  };
}

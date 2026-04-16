import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  CommandDefinition,
  startCommandService,
} from "@/src/services/commandService/commandService";
import { makeFakeClient, makeFakeInteraction } from "@/tests/utils";

const { mockRest } = vi.hoisted(() => ({
  mockRest: {
    setToken: vi.fn().mockReturnThis(),
    put: vi.fn().mockResolvedValue([]),
  },
}));

vi.mock("discord.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("discord.js")>();
  return {
    ...actual,
    REST: vi.fn(function () {
      return mockRest;
    }),
  };
});

const CLIENT_ID = "client-id";
const TOKEN = "token";

function makeCommand(name: string): CommandDefinition {
  return {
    builder: { name, toJSON: vi.fn().mockReturnValue({ name }) },
    handler: vi.fn().mockResolvedValue(undefined),
  };
}

describe("CommandService", () => {
  let client: ReturnType<typeof makeFakeClient>;

  beforeEach(() => {
    client = makeFakeClient();
    mockRest.put.mockClear();
  });

  it("registers commands with the Discord API", async () => {
    const command = makeCommand("msg");
    await startCommandService(client as never, CLIENT_ID, TOKEN, [command]);

    expect(mockRest.put).toHaveBeenCalledWith(
      expect.stringContaining(CLIENT_ID),
      expect.objectContaining({ body: [{ name: "msg" }] })
    );
  });

  it("dispatches an interaction to the matching command handler", async () => {
    const command = makeCommand("msg");
    await startCommandService(client as never, CLIENT_ID, TOKEN, [command]);

    const interaction = makeFakeInteraction("msg");
    await client.triggerEvent("interactionCreate", interaction);

    expect(command.handler).toHaveBeenCalledWith(interaction);
  });

  it("ignores interactions for unknown commands", async () => {
    const command = makeCommand("msg");
    await startCommandService(client as never, CLIENT_ID, TOKEN, [command]);

    const interaction = makeFakeInteraction("unknown");
    await client.triggerEvent("interactionCreate", interaction);

    expect(command.handler).not.toHaveBeenCalled();
  });

  it("replies with an error if the handler throws", async () => {
    const command = makeCommand("msg");
    vi.mocked(command.handler).mockRejectedValue(new Error("oops"));
    await startCommandService(client as never, CLIENT_ID, TOKEN, [command]);

    const interaction = makeFakeInteraction("msg");
    await client.triggerEvent("interactionCreate", interaction);

    expect(interaction.reply).toHaveBeenCalledWith(
      expect.objectContaining({ ephemeral: true, content: expect.stringContaining("oops") })
    );
  });
});

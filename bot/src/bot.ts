import { Client, GatewayIntentBits } from "discord.js";
import { getEnv } from "@/src/env";
import { createDynamicCallsServiceFromEnv } from "@/src/services/dynamicCalls/dynamicCallsService";
import { startCommandService } from "@/src/services/commandService/commandService";
import { createMessageService } from "@/src/services/message/messageService";
import { createChatService } from "@/src/services/chat/chatService";

async function main() {
  const env = await getEnv();
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildVoiceStates,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  const messageService = createMessageService(client);
  createChatService(client, env.groqToken);
  const dynamicCallsService = createDynamicCallsServiceFromEnv();

  client.on("ready", async () => {
    console.log("Bot Started");
    await startCommandService(client, env.clientId, env.token, [messageService.command]);
  });

  client.on("error", (err) => console.log(err));

  client.on("voiceStateUpdate", (oldState, newState) => {
    dynamicCallsService.handleVoiceStateUpdate(oldState, newState);
  });

  client.login(env.token);
}

main();

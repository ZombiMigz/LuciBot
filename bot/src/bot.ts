import { Client, GatewayIntentBits } from "discord.js";
import { getEnv } from "@/src/env";
import { createDynamicCallsServiceFromEnv } from "@/src/services/dynamicCalls/dynamicCallsService";

async function main() {
  const env = await getEnv();
  const client = new Client({ intents: [GatewayIntentBits.GuildVoiceStates] });
  const dynamicCallsService = createDynamicCallsServiceFromEnv();

  client.on("ready", () => console.log("Bot Started"));
  client.on("error", (err) => console.log(err));
  client.on("voiceStateUpdate", (oldState, newState) => {
    dynamicCallsService.handleVoiceStateUpdate(oldState, newState);
  });

  client.login(env.token);
}

main();

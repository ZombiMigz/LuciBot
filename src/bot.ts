import { Client, GatewayIntentBits } from "discord.js";
import { Feature } from "./features/Feature";
import { DynamicCallsModule } from "./features/dynamicCalls/dynamicCalls";
import { ENV } from "./env";
const client = new Client({ intents: [GatewayIntentBits.GuildVoiceStates] });

client.on("ready", () => console.log("Bot Started"));

client.on("error", (err) => {
  console.log(err);
});

const features: Feature[] = [DynamicCallsModule];

features.forEach((feature) => feature.init(client));

client.login(ENV.token);

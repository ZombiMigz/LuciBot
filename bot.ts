import { Client, Intents } from "discord.js";

import { initBDayHandler } from "./src/modules/birthday/birthdayHandler";
import { initCommandHandler } from "./src/commands/commandHandler";
import { initDebugger } from "./src/debug/debug";
import { settings } from "./src/settingsHandler";
import { initCallHandler } from "./src/modules/call/callHandler";

const Discord = require("discord.js");
// let flags = Intents.FLAGS;
// let intents = new Intents();
// intents.add(flags.GUILDS, flags.GUILD_VOICE_STATES, flags.GUILD_MESSAGES, flags.GUILD_MESSAGE_TYPING, flags.message);
export const client: Client = new Discord.Client({ intents: new Intents(32767) });

let { prefix, token } = settings;

client.on("ready", () => {
  console.log("initializing modules");
  initBDayHandler();
  initCallHandler();
  initDebugger();

  initCommandHandler();
  console.log("LuciBot Online and listening at prefix: " + prefix);
});

process.on("unhandledRejection", (err) => {
  client.login(token);
  console.log(`LUCIBOT CRASHED AT ${new Date().getHours()}:${new Date().getMinutes()}: \n${err}`);
});

client.options.retryLimit = 5;
client.options.restRequestTimeout = 30000;

console.log("attempting to login");
client
  .login(token)
  .then((res) => console.log("client logged in"))
  .catch((err) => {
    console.log(`Error logging in: ${err}`);
    setTimeout("Error timeout, bot will now shut off", 300000);
  });

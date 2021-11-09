import { Client } from 'discord.js';

import { initBDayHandler } from './src/birthday/birthdayHandler';
import { initCallHandler } from './src/call/callHandler';
import { initCommandHandler } from './src/commands/commandHandler';
import { initDebugger } from './src/debug/debug';
import { prefix, token } from './src/settingsHandler';
import { initWebEndpoint } from './src/web/webEndpoint';

const Discord = require("discord.js");
export const client: Client = new Discord.Client();

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
  .then(() => initWebEndpoint())
  .catch((err) => {
    console.log(`Error logging in: ${err}`);
    setTimeout("Error timeout, bot will now shut off", 300000);
  });

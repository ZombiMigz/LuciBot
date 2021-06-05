import { Client } from "discord.js";

import { initCallHandler } from "./src/call/callHandler";
import { prefix, token } from "./src/settingsHandler";
import { initCommandHandler } from "./src/commands/commandHandler";
import { initDebugger } from "./src/debug/debug";
import { initBDayHandler } from "./src/birthday/birthdayHandler";

const Discord = require('discord.js');
export const client: Client = new Discord.Client();


client.on('ready', () => { 

    console.log('initializing modules');
    initBDayHandler();
    initCallHandler();
    initDebugger();


    initCommandHandler();
    console.log('LuciBot Online and listening at prefix: ' + prefix);
})

client.options.retryLimit = 5;
client.options.restRequestTimeout = 30000;


console.log('attempting to login');
client.login(token)
    .then(res => console.log('client logged in'))
    .catch(err => console.log(`Error logging in: ${err}`));

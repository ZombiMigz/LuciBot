import { Client } from "discord.js";

import { initCallHandler } from "./src/call/callHandler";
import { prefix, token } from "./src/settingsHandler";
import { initCommandHandler } from "./src/commands/commandHandler";
import { initDebugger } from "./src/debug/debug";

const Discord = require('discord.js');
export const client: Client = new Discord.Client();


client.on('ready', () => { 

    console.log('initializing modules');
    initCallHandler();
    initDebugger();


    initCommandHandler();
    console.log('LuciBot Online and listening at prefix: ' + prefix);
})


console.log('attempting to login');
client.login(token);
console.log('client logged in');
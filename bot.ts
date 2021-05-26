import { Client } from "discord.js";

import { initCallHandler } from "./src/call/callHandler";
import { prefix, token } from "./src/settingsHandler";
import { initCommandHandler } from "./src/commands/commandHandler";
import { initDebugger } from "./src/debug/debug";

const Discord = require('discord.js');
export const client: Client = new Discord.Client();


client.on('ready', () => { 

    initCallHandler();
    initDebugger();


    initCommandHandler();
    console.log('LuciBot Online and listening at prefix: ' + prefix);
})



client.login(token) 
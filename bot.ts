import { Client } from "discord.js";
export const settings: Settings = require('./src/settings');
import { initCallHandler } from "./src/call/callHandler";
import { initCommandHandler } from "./src/commands/commandHandler";
import { initDebugger } from "./src/debug/debug";
import { Settings } from "./src/settings_template";

const Discord = require('discord.js');
export const client: Client = new Discord.Client();
const token = settings.token;




// const database = require('./database');
// const quotesHandler = require('./src/quotes/Handler');


const prefix: string = settings.prefix;


client.on('ready', () => { 
    initCallHandler();
    initDebugger();


    initCommandHandler(prefix);
    console.log('LuciBot Online and listening at prefix: ' + prefix);
})


client.login(token) 
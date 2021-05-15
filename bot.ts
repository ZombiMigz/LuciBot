import { CategoryChannel, Client, Guild, TextChannel, User, VoiceChannel, VoiceState } from "discord.js";
import { initCallHandler } from "./src/call/callHandler";
import { initCustomCallHandler } from "./src/call/customCallHandler";
import { initDebugger } from "./src/debug/debug";

const Discord = require('discord.js');
export const client: Client = new Discord.Client();
const token = 'NjcxMDkwMjE5ODUxODQxNTM3.Xi33eA.14eswi11TKXGpO53cwagp96nBHo';

// const database = require('./database');
// const quotesHandler = require('./src/quotes/Handler');

let prefix = '.'


client.on('ready', () => { 
    initCallHandler();
    initDebugger();
    console.log('LuciBot Online and listening at prefix: ' + prefix);
    // database.init();
    // quotesHandler.init();
})

/* 
client.on('message', msg => {
    if (msg.content.startsWith("spam ")) {
        user = msg.mentions.users.first().toString();
        for (i = 0; i < 10; i++) ping(msg.channel, user);
    }
})
function ping(channel, user) {
    channel.send(`${user}`)
    .then()
    .catch(console.error);
} 
*/

client.login(token) 
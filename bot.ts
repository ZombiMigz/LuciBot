import { CategoryChannel, Client, Guild, TextChannel, User, VoiceChannel, VoiceState } from "discord.js";

const Discord = require('discord.js');
const client = new Discord.Client();
const token = 'NjcxMDkwMjE5ODUxODQxNTM3.Xi33eA.14eswi11TKXGpO53cwagp96nBHo';
const handleJoin = require('./src/call/callHandler');

// const database = require('./database');
// const quotesHandler = require('./src/quotes/Handler');

let prefix = '.'

client.on('ready', () => {
    console.log('LuciBot Online and listening at prefix: ' + prefix);
    // database.init();
    // quotesHandler.init();
})

client.on('voiceStateUpdate', (fromState: VoiceState, state: VoiceState) => {
    handleJoin(fromState, state);
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

export {client as client};
client.login(token)
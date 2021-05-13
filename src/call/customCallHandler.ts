import { Channel, Client, DiscordAPIError, Message, TextChannel } from "discord.js";
import { client } from "../../bot";


const createChannelID: string = require('../channelIDs.json')["Custom Call Creator"]
let createChannel: TextChannel;

const tutorialMsg = "To create your own channel, type ```.create [channelname]``` Make sure to join the channel in 15 seconds or it will delete itself. Have fun!";

export function initCustomCallHandler() {
    console.log("create channel id " + createChannelID);
    client.channels.fetch(createChannelID)
        .then((res) => {
            createChannel = <TextChannel> res;
            createChannel.bulkDelete(100).catch(console.log);
            createChannel.send(tutorialMsg);
        })
        .catch((err) => console.log("Failed to find call creation text channel"));
    client.on('message', (msg) => {readMessage(msg)})
}

function readMessage(msg: Message) {
    /*if (createChannelID == msg.channel.id) {
        
    }*/
}
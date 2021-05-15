import { APIMessageContentResolvable, CategoryChannel, Channel, Client, DiscordAPIError, Guild, Message, TextChannel, VoiceChannel } from "discord.js";
import { client } from "../../bot";
import { addTempChannel } from "./callHandler";

const channelList = require('../channelIDs.json');
const createChannelID: string = channelList["Custom Call Creator"]
let channel: TextChannel;

const tutorialMsg = "To create your own channel, type ```.create [channelname]``` Make sure to join the channel in 15 seconds or it will delete itself. Have fun!";
const msgLengthError = "Your channel name was too long. Please try a shorter name. :)"
const misunderstoodError = "Sorry, I didn't understand."

export function initCustomCallHandler() {
    client.channels.fetch(createChannelID)
        .then((res) => {
            channel = <TextChannel> res;
            channel.bulkDelete(100).catch(console.log);
            channel.send(tutorialMsg);
        })
        .catch((err) => console.log("Failed to find call creation text channel"));
    client.on('message', (msg) => {readMessage(msg)})
}

function readMessage(msg: Message) {
    if (msg.author.bot) return;
    if (createChannelID == msg.channel.id){
        if (msg.content.split(' ')[0] == ".create") {
            if (msg.content.length > 100) sendError(msg, msgLengthError);
            let name:string = msg.content.substr(8);
            createChannel(name);
            msg.delete();
        } else {
            sendError(msg, misunderstoodError + ' ' + tutorialMsg);
        }
        
    } 
}

function createChannel(name: string) {
    client.channels.fetch(channelList["Voice Call Category"])
    .then((res) => {
        let category: CategoryChannel = <CategoryChannel> res;
        let guild:Guild = category.guild;
        guild.channels.create(name, {type: "voice"}).then(channel => {
            channel.setParent(category);
            setTimeout(() => {checkChannel(channel)}, 10000);
        })
    })
    .catch(console.log);
    
}

function checkChannel(channel: VoiceChannel) {
    if (channel.members.size < 1) {
        channel.delete();
        return;
    }
    addTempChannel(channel.id);
}

function sendError(msg: Message, error: String) {
    channel.send(<APIMessageContentResolvable> error)
        .then((res: Message) => {
            res.delete({timeout: 5000});
        })
        .catch(console.log);
    msg.delete({timeout:5000});
}
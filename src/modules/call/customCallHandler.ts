import { AnyChannel, CategoryChannel, Guild, Message, TextChannel, VoiceChannel } from "discord.js";
import { client } from "../../../bot";

import { settings } from "../../settingsHandler";
let { prefix } = settings;
let { textCreateID, category } = settings.customCallsModule;
import { addTempChannel, deleteChannel } from "./callHandler";

const tutorialMsg =
  "To create your own channel, type ```.create [channelname]``` Make sure to join the channel in 15 seconds or it will delete itself. Have fun!";
const msgLengthError = "Your channel name was too long or too short. Please keep the name between 1-100 characters. :)";
const misunderstoodError = "Sorry, I didn't understand.";
const unknownError = "I did not understand the channel name. Please try again.";

let createCallText: TextChannel;
export function initCustomCallHandler() {
  client.channels
    .fetch(textCreateID)
    .then((res) => {
      createCallText = <TextChannel>res;
      createCallText.bulkDelete(100).catch(console.log);
      createCallText.send(tutorialMsg);
    })
    .catch((err: string) => console.log("Failed to find call creation text channel:", err));
}

export function customCallMessage(msg: Message) {
  if (textCreateID == msg.channel.id) {
    if (msg.content.split(" ")[0] == prefix + "create") {
      let name: string = msg.content.substr(8);
      if (name.length > 100 || name.length < 1) {
        sendError(msg, msgLengthError);
        return;
      } else {
        createChannel(msg, name);
        try {
          msg.delete();
        } catch {
          console.log(`Failed to delete msg id: ${msg.id}\n with content: ${msg.content}`);
        }
      }
    } else {
      sendError(msg, misunderstoodError + " " + tutorialMsg);
    }
  }
}

function createChannel(msg: Message, name: string) {
  client.channels
    .fetch(category)
    .then((res: AnyChannel) => {
      let category = <CategoryChannel>res;
      let guild: Guild = category.guild;
      try {
        guild.channels.create(name, { type: "GUILD_VOICE" }).then((channel) => {
          channel.setParent(category);
          setTimeout(() => {
            checkChannel(channel);
          }, 10000);
        });
      } catch (err) {
        console.log(err);
        // sendError(msg, unknownError);
      }
    })
    .catch(console.log);
}

function checkChannel(channel: VoiceChannel) {
  if (channel.members.size < 1) {
    deleteChannel(channel);
    return;
  }
  addTempChannel(channel.id);
}

function sendError(msg: Message, error: string) {
  createCallText
    .send({ content: error })
    .then((res: Message) => {
      res.delete();
    })
    .catch(console.log);
  msg.delete();
}

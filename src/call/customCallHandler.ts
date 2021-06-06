import {
  APIMessageContentResolvable,
  CategoryChannel,
  Channel,
  Client,
  DiscordAPIError,
  Guild,
  Message,
  TextChannel,
  VoiceChannel,
} from "discord.js";
import { client } from "../../bot";
import {
  createCallTextID,
  customCallCategoryID,
  prefix,
} from "../settingsHandler";
import { addTempChannel, deleteChannel } from "./callHandler";

const tutorialMsg =
  "To create your own channel, type ```.create [channelname]``` Make sure to join the channel in 15 seconds or it will delete itself. Have fun!";
const msgLengthError =
  "Your channel name was too long or too short. Please keep the name between 1-100 characters. :)";
const misunderstoodError = "Sorry, I didn't understand.";
const unknownError = "I did not understand the channel name. Please try again.";

let createCallText: TextChannel;
export function initCustomCallHandler() {
  client.channels
    .fetch(createCallTextID)
    .then((res) => {
      createCallText = <TextChannel>res;
      createCallText.bulkDelete(100).catch(console.log);
      createCallText.send(tutorialMsg);
    })
    .catch((err) => console.log("Failed to find call creation text channel"));
}

export function customCallMessage(msg: Message) {
  if (createCallTextID == msg.channel.id) {
    if (msg.content.split(" ")[0] == prefix + "create") {
      let name: string = msg.content.substr(8);
      if (name.length > 100 || name.length < 1) {
        sendError(msg, msgLengthError);
        return;
      } else {
        createChannel(msg, name);
        msg.delete();
      }
    } else {
      sendError(msg, misunderstoodError + " " + tutorialMsg);
    }
  }
}

function createChannel(msg: Message, name: string) {
  client.channels
    .fetch(customCallCategoryID)
    .then((res) => {
      let category: CategoryChannel = <CategoryChannel>res;
      let guild: Guild = category.guild;
      try {
        guild.channels.create(name, { type: "voice" }).then((channel) => {
          channel.setParent(category);
          setTimeout(() => {
            checkChannel(channel);
          }, 10000);
        });
      } catch (err) {
        console.log(err);
        sendError(msg, unknownError);
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

function sendError(msg: Message, error: String) {
  createCallText
    .send(<APIMessageContentResolvable>error)
    .then((res: Message) => {
      res.delete({ timeout: 5000 });
    })
    .catch(console.log);
  msg.delete({ timeout: 5000 });
}

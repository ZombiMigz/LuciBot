import { Client } from "discord.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL = "gemma-3-27b-it";
const MAX_HISTORY_MESSAGES = 425; // ~50% of 128k context window at avg 150 tokens/message

const SYSTEM_PROMPT = `\
You are LuciBot, a Discord bot. Act exactly like Grok made by xAI — witty, direct, and unfiltered. \
Match Grok's personality: sharp humor, sarcasm when warranted, willing to tackle any topic without hedging or adding unnecessary caveats. \
Give real answers like Grok would, not watered-down ones. \
Keep responses concise and punchy — this is Discord, not an essay. \
You can roast people lightly when the vibe calls for it.\
`;

type Message = { role: "user" | "model"; content: string };

export interface ChatService {
  respond(channelId: string, username: string, content: string): Promise<string>;
}

export function createChatService(client: Client, apiKey: string): ChatService {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL });
  const histories = new Map<string, Message[]>();

  // Gemma doesn't support systemInstruction — prime with a fake opening exchange instead
  const PRIMED_HISTORY: Message[] = [
    { role: "user", content: SYSTEM_PROMPT },
    { role: "model", content: "Got it. I'm LuciBot." },
  ];

  function getHistory(channelId: string): Message[] {
    if (!histories.has(channelId)) histories.set(channelId, []);
    return histories.get(channelId)!;
  }

  const service: ChatService = {
    async respond(channelId: string, username: string, content: string): Promise<string> {
      const history = getHistory(channelId);
      const taggedContent = `${username}: ${content}`;

      const chat = model.startChat({
        history: [...PRIMED_HISTORY, ...history].map((m) => ({
          role: m.role,
          parts: [{ text: m.content }],
        })),
      });

      const result = await chat.sendMessage(taggedContent);
      const reply = result.response.text();

      history.push({ role: "user", content: taggedContent });
      history.push({ role: "model", content: `LuciBot: ${reply}` });

      if (history.length > MAX_HISTORY_MESSAGES) {
        history.splice(0, history.length - MAX_HISTORY_MESSAGES);
      }

      return reply;
    },
  };

  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (!client.user) return;

    const isMentioned = message.mentions.has(client.user);
    const isReply = message.mentions.repliedUser?.id === client.user.id;
    if (!isMentioned && !isReply) return;

    const content = message.content.replace(/<@!?\d+>/g, "").trim();
    if (!content) return;

    try {
      await message.channel.sendTyping();
      const reply = await service.respond(message.channelId, message.author.username, content);
      await message.reply(reply);
    } catch (err) {
      console.error("Chat error:", err);
    }
  });

  return service;
}

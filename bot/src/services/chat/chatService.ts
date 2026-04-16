import { Client } from "discord.js";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
const MODEL = "gemini-2.0-flash";
const MAX_HISTORY_MESSAGES = 100; // 50 exchanges — well within 128k context window

const SYSTEM_PROMPT = `\
You are LuciBot, a Discord bot. Act exactly like Grok made by xAI — witty, direct, and unfiltered. \
Match Grok's personality: sharp humor, sarcasm when warranted, willing to tackle any topic without hedging or adding unnecessary caveats. \
Give real answers like Grok would, not watered-down ones. \
Keep responses concise and punchy — this is Discord, not an essay. \
You can roast people lightly when the vibe calls for it.\
`;

type Message = { role: "user" | "assistant" | "system"; content: string };

export interface ChatService {
  respond(channelId: string, content: string): Promise<string>;
}

export function createChatService(client: Client, apiKey: string): ChatService {
  const histories = new Map<string, Message[]>();

  function getHistory(channelId: string): Message[] {
    if (!histories.has(channelId)) histories.set(channelId, []);
    return histories.get(channelId)!;
  }

  const service: ChatService = {
    async respond(channelId: string, content: string): Promise<string> {
      const history = getHistory(channelId);
      history.push({ role: "user", content });

      if (history.length > MAX_HISTORY_MESSAGES) {
        history.splice(0, history.length - MAX_HISTORY_MESSAGES);
      }

      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [{ role: "system", content: SYSTEM_PROMPT }, ...history],
        }),
      });

      if (response.status === 429) {
        history.pop();
        const retryAfter = parseInt(response.headers.get("retry-after") ?? "0");
        if (retryAfter > 0) {
          const wait =
            retryAfter < 60 ? `${retryAfter} seconds` : `${Math.ceil(retryAfter / 60)} minutes`;
          return `I've run out of free tokens. Try again in ~${wait}.`;
        }
        return "I've run out of free tokens. Please try again later.";
      }

      if (!response.ok) {
        history.pop();
        throw new Error(`Groq API error: ${response.status}`);
      }

      const data = (await response.json()) as {
        choices: [{ message: { content: string } }];
      };
      const reply = data.choices[0].message.content;
      history.push({ role: "assistant", content: reply });
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
      const reply = await service.respond(message.channelId, content);
      await message.reply(reply);
    } catch (err) {
      console.error("Chat error:", err);
    }
  });

  return service;
}

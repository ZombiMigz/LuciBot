import { Client } from "discord.js";
import {
  ChatSession,
  Content,
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";

const MODEL = "gemma-3-27b-it";
const COMPRESS_AFTER = 50; // compress when session hits this many messages
const KEEP_RECENT = 20; // keep this many recent messages uncompressed after compression

const SYSTEM_PROMPT = `\
You are LuciBot, a Discord bot. Act exactly like Grok made by xAI — witty, direct, and unfiltered. \
Match Grok's personality: sharp humor, sarcasm when warranted, willing to tackle any topic without hedging or adding unnecessary caveats. \
Give real answers like Grok would, not watered-down ones. \
Keep responses concise and punchy — this is Discord, not an essay. \
You can roast people lightly when the vibe calls for it.\
`;

// Gemma doesn't support systemInstruction — prime with a fake opening exchange instead
const PRIMED_HISTORY: Content[] = [
  { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
  { role: "model", parts: [{ text: "Got it. I'm LuciBot." }] },
];

type ChannelSession = { chat: ChatSession; messageCount: number };

export interface ChatService {
  respond(channelId: string, username: string, content: string): Promise<string>;
}

export function createChatService(client: Client, apiKey: string): ChatService {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL });
  const sessions = new Map<string, ChannelSession>();

  function newSession(history: Content[] = PRIMED_HISTORY): ChannelSession {
    return { chat: model.startChat({ history }), messageCount: 0 };
  }

  function getSession(channelId: string): ChannelSession {
    if (!sessions.has(channelId)) sessions.set(channelId, newSession());
    return sessions.get(channelId)!;
  }

  async function compressSession(session: ChannelSession): Promise<ChannelSession> {
    const history = await session.chat.getHistory();
    // history includes PRIMED_HISTORY at the front — skip it when compressing
    const conversationHistory = history.slice(PRIMED_HISTORY.length);
    const toCompress = conversationHistory.slice(0, conversationHistory.length - KEEP_RECENT);
    const recent = conversationHistory.slice(conversationHistory.length - KEEP_RECENT);

    const transcript = toCompress.map((m) => m.parts.map((p) => p.text).join("")).join("\n");
    const summaryModel = genAI.getGenerativeModel({
      model: MODEL,
      generationConfig: { maxOutputTokens: 400 },
    });
    const summaryChat = summaryModel.startChat({ history: [] });
    const result = await summaryChat.sendMessage(
      `Summarize the following Discord conversation in at most 300 words. Bullet-point format. Preserve key facts, topics, opinions, and who said what.\n\n${transcript}`
    );
    const summary = result.response.text();

    return newSession([
      ...PRIMED_HISTORY,
      { role: "user", parts: [{ text: "[Earlier conversation summary]" }] },
      { role: "model", parts: [{ text: `LuciBot: ${summary}` }] },
      ...recent,
    ]);
  }

  const service: ChatService = {
    async respond(channelId: string, username: string, content: string): Promise<string> {
      let session = getSession(channelId);

      if (session.messageCount >= COMPRESS_AFTER) {
        session = await compressSession(session);
        sessions.set(channelId, session);
      }

      const result = await session.chat.sendMessage(`${username}: ${content}`);
      const reply = result.response.text();
      session.messageCount++;

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
      if (err instanceof GoogleGenerativeAIFetchError && err.status === 429) {
        const retryInfo = err.errorDetails?.find((d) =>
          (d["@type"] as string)?.includes("RetryInfo")
        );
        const delay = retryInfo?.["retryDelay"] as string | undefined;
        const wait = delay ? ` Try again in ${delay}.` : " Try again in about a minute.";
        await message.reply(`I've hit the rate limit.${wait}`);
      } else {
        console.error("Chat error:", err);
      }
    }
  });

  return service;
}

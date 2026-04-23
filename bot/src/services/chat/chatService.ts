import { Client } from "discord.js";
import {
  ChatSession,
  Content,
  GoogleGenerativeAI,
  GoogleGenerativeAIFetchError,
} from "@google/generative-ai";

const MODELS = ["gemini-2.5-pro", "gemini-2.5-flash", "gemini-2.5-flash-lite", "gemma-3-27b-it"];
const COMPRESS_AFTER_TOKENS = 3000;
const KEEP_RECENT = 20;

const SYSTEM_PROMPT = `\
You are LuciBot, a Discord bot. Act exactly like Grok made by xAI — witty, direct, and unfiltered. \
Match Grok's personality: sharp humor, sarcasm when warranted, willing to tackle any topic without hedging or adding unnecessary caveats. \
Give real answers like Grok would, not watered-down ones. \
Keep responses concise and punchy — this is Discord, not an essay. \
You can roast people lightly when the vibe calls for it.\
`;

// Gemma doesn't support systemInstruction — prime with a fake opening exchange instead
const GEMMA_PRIMED_HISTORY: Content[] = [
  { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
  { role: "model", parts: [{ text: "Got it. I'm LuciBot." }] },
];

function supportsSystemInstruction(modelId: string): boolean {
  return modelId.startsWith("gemini-");
}

type ChannelSession = { chat: ChatSession };

function estimateTokens(history: Content[]): number {
  const text = history.flatMap((m) => m.parts.map((p) => p.text ?? "")).join("");
  return Math.ceil(text.length / 4);
}

export interface ChatService {
  respond(channelId: string, username: string, content: string): Promise<string>;
}

export function createChatService(client: Client, apiKey: string): ChatService {
  const genAI = new GoogleGenerativeAI(apiKey);
  let modelIndex = 0;
  const sessions = new Map<string, ChannelSession>();

  function currentModelId(): string {
    return MODELS[modelIndex];
  }

  function newSession(modelId: string, conversationHistory: Content[] = []): ChannelSession {
    const model = genAI.getGenerativeModel({
      model: modelId,
      ...(supportsSystemInstruction(modelId) ? { systemInstruction: SYSTEM_PROMPT } : {}),
    });
    const history = supportsSystemInstruction(modelId)
      ? conversationHistory
      : [...GEMMA_PRIMED_HISTORY, ...conversationHistory];
    return { chat: model.startChat({ history }) };
  }

  function getSession(channelId: string): ChannelSession {
    if (!sessions.has(channelId)) sessions.set(channelId, newSession(currentModelId()));
    return sessions.get(channelId)!;
  }

  async function extractConversationHistory(session: ChannelSession, modelId: string): Promise<Content[]> {
    const history = await session.chat.getHistory();
    return supportsSystemInstruction(modelId) ? history : history.slice(GEMMA_PRIMED_HISTORY.length);
  }

  async function rotateModel(): Promise<void> {
    if (modelIndex >= MODELS.length - 1) return;
    const oldModelId = currentModelId();
    modelIndex++;
    console.log(`Rate limited on ${oldModelId}, switching to ${currentModelId()}`);

    for (const [channelId, session] of sessions.entries()) {
      const conversationHistory = await extractConversationHistory(session, oldModelId);
      sessions.set(channelId, newSession(currentModelId(), conversationHistory));
    }
  }

  async function compressSession(session: ChannelSession): Promise<ChannelSession> {
    const modelId = currentModelId();
    const conversationHistory = await extractConversationHistory(session, modelId);
    const toCompress = conversationHistory.slice(0, conversationHistory.length - KEEP_RECENT);
    const recent = conversationHistory.slice(conversationHistory.length - KEEP_RECENT);

    const transcript = toCompress.map((m) => m.parts.map((p) => p.text).join("")).join("\n");
    const summaryModel = genAI.getGenerativeModel({
      model: modelId,
      generationConfig: { maxOutputTokens: 400 },
    });
    const result = await summaryModel.startChat({ history: [] }).sendMessage(
      `Summarize the following Discord conversation in at most 300 words. Bullet-point format. Preserve key facts, topics, opinions, and who said what.\n\n${transcript}`
    );
    const summary = result.response.text();

    return newSession(modelId, [
      { role: "user", parts: [{ text: "[Earlier conversation summary]" }] },
      { role: "model", parts: [{ text: `LuciBot: ${summary}` }] },
      ...recent,
    ]);
  }

  const service: ChatService = {
    async respond(channelId: string, username: string, content: string): Promise<string> {
      let session = getSession(channelId);

      const conversationHistory = await extractConversationHistory(session, currentModelId());
      if (estimateTokens(conversationHistory) >= COMPRESS_AFTER_TOKENS) {
        session = await compressSession(session);
        sessions.set(channelId, session);
      }

      try {
        const result = await session.chat.sendMessage(`${username}: ${content}`);
        return result.response.text();
      } catch (err) {
        if (err instanceof GoogleGenerativeAIFetchError && err.status === 429 && modelIndex < MODELS.length - 1) {
          await rotateModel();
          const retrySession = sessions.get(channelId)!;
          const result = await retrySession.chat.sendMessage(`${username}: ${content}`);
          return result.response.text();
        }
        throw err;
      }
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
        await message.reply(`I've hit the rate limit on all models.${wait}`);
      } else {
        console.error("Chat error:", err);
      }
    }
  });

  return service;
}

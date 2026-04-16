import { Client, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from "discord.js";
import { CommandDefinition } from "@/src/services/commandService/commandService";

export interface MessageService {
  sendMessage(channelId: string, content: string): Promise<void>;
  command: CommandDefinition;
}

export function createMessageService(client: Client): MessageService {
  const sendMessage = async (channelId: string, content: string): Promise<void> => {
    const channel = await client.channels.fetch(channelId);
    if (!(channel instanceof TextChannel)) {
      throw new Error(`Channel ${channelId} is not a text channel`);
    }
    await channel.send(content);
  };

  const command: CommandDefinition = {
    builder: new SlashCommandBuilder()
      .setName("msg")
      .setDescription("Send a message to a channel")
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .addChannelOption((option) =>
        option.setName("channel").setDescription("Channel to send the message to").setRequired(true)
      )
      .addStringOption((option) =>
        option.setName("message").setDescription("Message to send").setRequired(true)
      ),
    handler: async (interaction) => {
      const channel = interaction.options.getChannel("channel", true);
      const content = interaction.options.getString("message", true);
      await sendMessage(channel.id, content);
      await interaction.reply({ content: "Message sent!", ephemeral: true });
    },
  };

  return { sendMessage, command };
}

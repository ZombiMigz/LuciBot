import { ChatInputCommandInteraction, Client, REST, Routes, SlashCommandBuilder } from "discord.js";
import { GUILD_ID } from "@/src/env";

export interface CommandDefinition {
  builder: Pick<SlashCommandBuilder, "name" | "toJSON">;
  handler: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

export async function startCommandService(
  client: Client,
  clientId: string,
  token: string,
  commands: CommandDefinition[]
): Promise<void> {
  const rest = new REST().setToken(token);
  await rest.put(Routes.applicationGuildCommands(clientId, GUILD_ID), {
    body: commands.map((c) => c.builder.toJSON()),
  });
  console.log("Commands registered");

  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = commands.find((c) => c.builder.name === interaction.commandName);
    if (!command) return;

    try {
      await command.handler(interaction);
    } catch (err) {
      await interaction.reply({ content: `Error: ${err}`, ephemeral: true });
    }
  });
}

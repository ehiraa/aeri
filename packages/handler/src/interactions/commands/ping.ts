import { SlashCommandBuilder } from "../../classes/slashCommandBuilder.js";
import type { ChatInputCommand } from "../../services/commands.js";

export const interaction: ChatInputCommand = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Replies with Pong! (Used for testing)")
        .addExample("/ping"),
    async execute(interaction): Promise<void> {
        await interaction.reply({ content: "Pong!" });
    },
};

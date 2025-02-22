import { env } from "core";
import { dbFetchAnilistUser } from "database";
import { Logger } from "logger";
import { SlashCommandBuilder } from "../../classes/slashCommandBuilder.js";
import type { ChatInputCommand } from "../../services/commands.js";

const logger = new Logger();

export const interaction: ChatInputCommand = {
    cooldown: 1800,
    data: new SlashCommandBuilder()
        .setName("refresh")
        .setDescription("Refresh your scores in the cache")
        .addExample("/refresh")
        .addExample("Must have used /setup before using this command"),
    async execute(interaction): Promise<void> {
        const anilistUser = await dbFetchAnilistUser(interaction.user_id);

        const userId = anilistUser ? anilistUser.id : null;
        const username = anilistUser ? anilistUser.username : null;

        if (username === null) {
            return interaction.reply({
                content:
                    "You must link your Anilist account to use this command. You can do so by using the `/setup` command.",
                ephemeral: true,
            });
        }

        const response = await fetch(`${env.API_URL}/remove-user`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId?.toString(),
                username: username,
            }),
        }).catch((error) => {
            logger.error("Error when trying to remove cache", "Refresh", error);
            return null;
        });

        if (response === null) {
            logger.error("Request returned null", "Refresh");
            return interaction.reply({ content: "Problem trying to remove cache", ephemeral: true });
        }

        const result = await response.json().catch((error) => {
            logger.error("Error while parsing JSON data.", "Refresh", error);
            return interaction.reply({ content: "Problem trying to remove cache", ephemeral: true });
        });

        if (result === null) {
            return interaction.reply({ content: "Problem trying to remove cache", ephemeral: true });
        }

        await interaction.reply({ content: result.message, ephemeral: true });
    },
};

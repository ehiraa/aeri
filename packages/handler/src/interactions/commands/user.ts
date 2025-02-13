import { EmbedBuilder } from "@discordjs/builders";
import { fetchAnilistUser } from "database";
import { ApplicationCommandOptionType } from "discord-api-types/v10";
import { Logger } from "logger";
import { Routes, api } from "wrappers/anilist";
import { type Command, SlashCommandBuilder } from "../../classes/slashCommandBuilder.js";
import { getCommandOption } from "../../utility/interactionUtils.js";

const logger = new Logger();
export const interaction: Command = {
    cooldown: 5,
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("View a user's anilist account")
        .addExample("/user")
        .addExample("/user username:anilist_username")
        .addStringOption((option) =>
            option.setName("username").setDescription("The targets anilist username").setRequired(false),
        ),
    async execute(interaction): Promise<void> {
        let username = getCommandOption("username", ApplicationCommandOptionType.String, interaction.options);

        if (username === null) {
            logger.debug("Attemping fetching user from database", "User");
            try {
                username = (await fetchAnilistUser(interaction.member_id)).username;
            } catch (error: any) {
                logger.error(`Error fetching user from database: ${error}`, "User");
                return interaction.reply({ content: "Please setup your account with /setup!", ephemeral: true });
            }
        }

        logger.debug(`Fetching user: ${username}`, "User");
        const { result: user, error } = await api.fetch(Routes.User, { username });

        if (user === undefined) {
            logger.error("Error while fetching data from the API.", "Anilist", error);

            return interaction.reply({
                content: "An error occurred while fetching data from the API.",
                ephemeral: true,
            });
        }

        if (user === null) {
            return interaction.reply({
                content: "User could not be found. Are you sure you have the correct username?",
                ephemeral: true,
            });
        }

        const embed = new EmbedBuilder()
            .setTitle(user.name)
            .setURL(user.siteUrl)
            .setDescription(user.description)
            .setThumbnail(user.avatar)
            .setImage(user.banner)
            .setFooter({ text: user.footer })
            .setColor(0x2f3136);

        return interaction.reply({
            embeds: [embed],
        });
    },
};

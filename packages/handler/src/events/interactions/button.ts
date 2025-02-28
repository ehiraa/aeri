import { MessageFlags } from "@discordjs/core";
import { checkRedis, setExpireCommand } from "core";
import { Logger } from "logger";
import type { ButtonHandler } from "../../classes/ButtonInteraction.js";

const logger = new Logger();

export const handler: ButtonHandler = async (interaction, api, client) => {
    logger.debugSingle(`Received button interaction: ${interaction.data.custom_id}`, "Handler");

    const [buttonId, ...data] = interaction.data.custom_id.split(":") as [string, ...string[]];
    const button = client.buttons.get(buttonId);

    if (!button) {
        logger.warnSingle(`Button not found: ${buttonId}`, "Handler");
        return;
    }

    const memberId = interaction.user.id;

    if (!memberId) {
        logger.warnSingle("Member was not found", "Handler");
        return;
    }

    const toggleable = button.toggleable ?? false;
    const timeout = button.timeout ?? 3600;

    logger.debug("Checking if command is toggleable", "Handler", { toggleable, memberId, data });
    if (toggleable && !data.includes(memberId)) {
        await api.interactions.reply(interaction.id, interaction.token, {
            content: "Only the user who toggled this command can use it",
            flags: MessageFlags.Ephemeral,
        });
        return;
    }

    const expireKey = `button:${interaction.channel.id}:${interaction.message.id}`;
    const setExpire = await setExpireCommand(expireKey, timeout);

    if (!setExpire) {
        logger.debugSingle(`${buttonId} already exists in redis`, "Handler");
    } else {
        logger.debugSingle(`Set expire time for select menu: ${buttonId}`, "Handler");
    }

    const redisKey = `${buttonId}_${memberId}`;
    const check = await checkRedis(redisKey, button, memberId);
    if (check !== 0) {
        return api.interactions.reply(interaction.id, interaction.token, {
            content: `You may use this command again in <t:${check}:R>`,
            flags: MessageFlags.Ephemeral,
        });
    }

    try {
        logger.infoSingle(`Executing button: ${buttonId}`, "Handler");
        button.execute(interaction, button.parse?.(data));
    } catch (error: any) {
        logger.error("Button execution error:", "Handler", error);
    }
};

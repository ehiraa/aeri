import type { API } from "@discordjs/core";
import type { APIMessage, APIMessageApplicationCommandInteraction } from "discord-api-types/v10";
import { BaseInteraction } from "./BaseInteraction.js";
import type { HandlerClient } from "./HandlerClient.js";

export type MessageContextHandler = (
    interaction: MessageContextInteraction,
    api: API,
    client: HandlerClient,
) => Promise<void>;

export class MessageContextInteraction extends BaseInteraction {
    constructor(
        public override interaction: APIMessageApplicationCommandInteraction,
        api: API,
        client: HandlerClient,
    ) {
        super(interaction, api, client);
    }

    get data() {
        return this.interaction.data;
    }

    get commandName() {
        return this.interaction.data.name;
    }

    get target_id() {
        return this.interaction.data.target_id;
    }

    get target() {
        return this.interaction.data.resolved.messages[this.target_id] as APIMessage;
    }
}

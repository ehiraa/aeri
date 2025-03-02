import { Counter } from "prom-client";
import type { SerializedHandlerMetrics } from "./HandlerMetricsClient.js";
import type { SerializedWorkerMetrics } from "./WorkerMetricsClient.js";

export class MetricsClient {
    public gateway_events = new Counter({
        name: "gateway_events_received_total",
        help: "Total number of events received",
        labelNames: ["type", "shard_id", "worker_id"] as const,
    });

    public handler_events = new Counter({
        name: "handler_events_received_total",
        help: "Total number of events received per handler",
        labelNames: ["handler_id"] as const,
    });

    public media_commands = new Counter({
        name: "handler_media_commands_total",
        help: "Total number of media commands received",
        labelNames: ["media_type", "media_id", "media_name"] as const,
    });

    public interaction_types = new Counter({
        name: "handler_interaction_types_total",
        help: "Total number of commands received",
        labelNames: ["type"] as const,
    });

    public async mergeGatewayMetrics(data: SerializedWorkerMetrics) {
        for (const item of data.values) {
            this.gateway_events.inc(item.labels, item.value);
        }
    }

    public mergeHandlerMetrics(data: SerializedHandlerMetrics) {
        for (const item of data.events.values) {
            this.handler_events.inc(item.labels, item.value);
        }

        for (const item of data.mediaCommands.values) {
            this.media_commands.inc(item.labels, item.value);
        }

        for (const item of data.interactionTypes.values) {
            this.interaction_types.inc(item.labels, item.value);
        }
    }
}

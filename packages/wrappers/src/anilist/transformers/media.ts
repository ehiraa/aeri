import { inlineCode } from "@discordjs/formatters";
import { formatSeconds } from "core";
import { dbFetchGuildUsers } from "database";
import { MediaListStatus, api } from "../index.js";
import { Routes } from "../types.js";
import type { TransformersType } from "./index.js";
import { filteredDescription } from "./util.js";

export const mediaTransformer: TransformersType[Routes.Media] = async (data, { guild_id }) => {
    const genresToShow = data.genres.slice(0, 3);
    const additionalGenresCount = data.genres.length - genresToShow.length;
    const genresDisplay =
        genresToShow.join(", ") + (additionalGenresCount > 0 ? ` + ${additionalGenresCount} more` : "");

    const currentEpisode = data.airing?.[0]?.nodes?.[0]?.episode ? data.airing[0].nodes[0].episode - 1 : null;
    const nextEpisode = data.airing?.[0]?.nodes?.[0]?.episode
        ? formatSeconds(data.airing[0].nodes[0].timeUntilAiring)
        : null;

    const userData: {
        current: string[];
        planning: string[];
        completed: string[];
        dropped: string[];
        paused: string[];
    } = {
        current: [],
        planning: [],
        completed: [],
        dropped: [],
        paused: [],
    };

    const userResults: { username: string; score: number; progress: number; status: MediaListStatus }[] = [];
    const allUsers = await dbFetchGuildUsers(guild_id).then((users: any) => {
        return users.map((user: { anilist: any }) => user.anilist.username);
    });

    if (allUsers.length !== 0) {
        const maxLength = Math.max(...allUsers.map((user: any) => user.length + 2));

        for (const member in allUsers) {
            const { result: userScore, error } = await api.fetch(Routes.UserScore, {
                user_name: String(allUsers[member]),
                media_id: data.id,
            });

            if (error || !userScore) {
                continue;
            }

            userResults.push({
                username: userScore.username,
                score: userScore.score ?? 0,
                progress: userScore.progress ?? 0,
                status: userScore.status ?? MediaListStatus.Current,
            });

            const formatProgress = userScore.progress?.toString().padStart(2, "0") ?? "00";
            const formatScore = userScore.score?.toString().padStart(2, "0") ?? "00";

            switch (userScore?.status) {
                case "REPEATING":
                    userData.current.push(
                        `> ${inlineCode(`${userScore.username.padEnd(maxLength)}:`)} ${inlineCode(` ${formatProgress} | ${formatScore}/10 (${userScore.repeat})`)}\n`,
                    );
                    break;
                case "CURRENT": {
                    const userRepeats = userScore.repeat && userScore.repeat > 0 ? `(${userScore.repeat})` : "";
                    userData.current.push(
                        `> ${inlineCode(`${userScore.username.padEnd(maxLength)}:`)} ${inlineCode(` ${formatProgress} | ${formatScore}/10 ${userRepeats}`)}\n`,
                    );
                    break;
                }
                case "COMPLETED": {
                    const userRepeats = userScore.repeat && userScore.repeat > 0 ? `(${userScore.repeat})` : "";
                    userData.completed.push(
                        `> ${inlineCode(`${userScore.username.padEnd(maxLength)}:`)} ${inlineCode(` ${formatScore}/10 ${userRepeats}`)}\n`,
                    );
                    break;
                }
                case "PLANNING":
                    userData.planning.push(`> ${inlineCode(userScore.username)}\n`);
                    break;
                case "DROPPED":
                    userData.dropped.push(
                        `> ${inlineCode(`${userScore.username.padEnd(maxLength)}:`)} ${inlineCode(` ${formatProgress} | ${formatScore}/10`)}\n`,
                    );
                    break;
                case "PAUSED":
                    userData.paused.push(
                        `> ${inlineCode(`${userScore.username.padEnd(maxLength)}:`)} ${inlineCode(` ${formatProgress} | ${formatScore}/10`)}\n`,
                    );
                    break;
                default:
                    break;
            }
        }
    }

    const descriptionBuilder = [
        `${inlineCode("total episodes    :")} ${data.episodes?.toLocaleString("en-US")}\n`,
        `${inlineCode("current episode   :")} ${currentEpisode?.toLocaleString("en-US")}\n`,
        `${inlineCode("next airing       :")} ${nextEpisode}\n`,
        `${inlineCode("chapters          :")} ${data.chapters?.toLocaleString("en-US")}\n`,
        `${inlineCode("volumes           :")} ${data.volumes?.toLocaleString("en-US")}\n`,
        `${inlineCode("status            :")} ${data.status}\n`,
        `${inlineCode("average score     :")} ${data.averageScore}%\n`,
        `${inlineCode("mean score        :")} ${data.meanScore}%\n`,
        `${inlineCode("popularity        :")} ${data.popularity?.toLocaleString("en-US")}\n`,
        `${inlineCode("favourites        :")} ${data.favourites?.toLocaleString("en-US")}\n`,
        `${inlineCode("start date        :")} ${data.startDate}\n`,
        `${inlineCode("end date          :")} ${data.endDate}\n`,
        `${inlineCode("genres            :")} ${genresDisplay}\n\n`,
        `${inlineCode("completed         :")} \n ${userData.completed.join("")}\n`,
        `${inlineCode("current           :")} \n ${userData.current.join("")}\n`,
        `${inlineCode("planning          :")} \n ${userData.planning.join("")}\n`,
        `${inlineCode("dropped           :")}\n ${userData.dropped.join("")}\n`,
        `${inlineCode("paused            :")}\n ${userData.paused.join("")}\n\n`,
    ];
    const filtered = filteredDescription(descriptionBuilder, false);

    return {
        description: filtered,
        userResults,
    };
};

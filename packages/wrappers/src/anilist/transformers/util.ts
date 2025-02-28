export function filteredDescription(description: string | string[], set_spoiler: boolean): string {
    if (typeof description === "string") {
        return description
            .split("\n")
            .map((line: any) => {
                if ((set_spoiler && line.startsWith("~!")) || line.endsWith("!~")) {
                    return `||${line.slice(2, -2)}||`;
                }
                return line;
            })
            .filter((line: any) => {
                return !(/^\s*$/.test(line) || /null/.test(line) || /undefined/.test(line) || /0\/0\/0/.test(line));
            })
            .join("\n");
    }

    return description
        .filter((line) => {
            return !(/^\s*$/.test(line) || /null/.test(line) || /undefined/.test(line) || /0\/0\/0/.test(line));
        })
        .join("");
}

export function truncateAnilistDescription(description: string, itemsToRemove: number): string {
    const lines = description.split("\n");
    const truncatedLines = lines.slice(0, lines.length - itemsToRemove);
    const remainingItems = lines.length - truncatedLines.length;
    return `${truncatedLines.join("\n")}\n+ ${remainingItems} more`;
}

export function truncateAnilistIfExceedsDescription(description: string, maxLength: number): string {
    if (description.length > maxLength) {
        const excessLength = description.length - maxLength;
        const itemsToRemove = Math.ceil(excessLength / 100);
        return truncateAnilistDescription(description, itemsToRemove);
    }
    return description;
}

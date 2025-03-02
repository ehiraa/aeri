import { env } from "@/env";

interface CommandOption {
  name: string;
  description: string;
  required: boolean;
  type: number;
  choices?: Array<{ name: string, value: string }>;
  autocomplete?: boolean;
}

export interface Command {
  name: string;
  category: string;
  description: string;
  examples: string[];
  options: CommandOption[];
  type: number;
  cooldown?: number;
}

export default async function GetCommands(): Promise<Command[]> {
  try {
    const response = await fetch(`${env.API_URL}/commands`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching commands: ", error);
    return [];
  }
}

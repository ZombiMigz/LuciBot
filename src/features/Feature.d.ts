import { Client, REST } from "discord.js";

export interface Feature {
  init: (client: Client) => void;
  registerCommands?: (rest: REST) => void;
}

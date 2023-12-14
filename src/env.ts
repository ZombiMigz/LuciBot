import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  token: process.env.token ?? "",
  clientId: process.env.clientId ?? "",
  guildId: process.env.guildId ?? "",
  dynamicCallCategoryId: process.env.dynamicCallCategoryId ?? "",
  dynamicCallCreateId: process.env.dynamicCallCreateId ?? "",
} as const;

import dotenv from "dotenv";
import { z } from "zod";

const envSchema = z.object({
  token: z.string().min(1),
  clientId: z.string().min(1),
  guildId: z.string().min(1),
  dynamicCallCategoryId: z.string().min(1),
  dynamicCallCreateId: z.string().min(1),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | null = null;

export function getEnv(): Env {
  if (cached) return cached;

  dotenv.config();

  const parsed = envSchema.safeParse({
    token: process.env.token,
    clientId: process.env.clientId,
    guildId: process.env.guildId,
    dynamicCallCategoryId: process.env.dynamicCallCategoryId,
    dynamicCallCreateId: process.env.dynamicCallCreateId,
  });

  if (!parsed.success) {
    console.error("Missing or invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  cached = parsed.data;
  return cached;
}

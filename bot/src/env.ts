import dotenv from "dotenv";

const GCP_PROJECT = "lucibot-493305";

export const GUILD_ID = "401834711275667465";
export const DYNAMIC_CALL_CATEGORY_ID = "842224094959370300";
export const DYNAMIC_CALL_CREATE_ID = "842224157407707136";

export interface Env {
  token: string;
  clientId: string;
  geminiToken: string;
}

let cached: Env | null = null;

async function fetchSecret(secretId: string): Promise<string> {
  const tokenRes = await fetch(
    "http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/token",
    { headers: { "Metadata-Flavor": "Google" } }
  );
  const { access_token } = (await tokenRes.json()) as { access_token: string };

  const res = await fetch(
    `https://secretmanager.googleapis.com/v1/projects/${GCP_PROJECT}/secrets/${secretId}/versions/latest:access`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
  const data = (await res.json()) as { payload: { data: string } };
  return Buffer.from(data.payload.data, "base64").toString();
}

export async function getEnv(): Promise<Env> {
  if (cached) return cached;

  dotenv.config();

  const token = process.env.token;
  const clientId = process.env.clientId;
  const geminiToken = process.env.geminiToken;

  if (token && clientId && geminiToken) {
    cached = { token, clientId, geminiToken };
    return cached;
  }

  try {
    const [fetchedToken, fetchedClientId, fetchedGeminiToken] = await Promise.all([
      fetchSecret("TOKEN_ID"),
      fetchSecret("CLIENT_ID"),
      fetchSecret("GEMINI_TOKEN"),
    ]);
    cached = { token: fetchedToken, clientId: fetchedClientId, geminiToken: fetchedGeminiToken };
    return cached;
  } catch (err) {
    console.error("Failed to fetch secrets from Secret Manager:", err);
    process.exit(1);
  }
}

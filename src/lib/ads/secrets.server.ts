import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from "node:crypto";

function secretBytes() {
  const seed =
    process.env.BETTER_AUTH_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.XAI_API_KEY ||
    "adfuel-dev-key-material";
  return scryptSync(seed, "adfuel.ai.connections.v1", 32);
}

export function encryptSecret(plain: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", secretBytes(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1.${iv.toString("base64url")}.${tag.toString("base64url")}.${enc.toString("base64url")}`;
}

export function decryptSecret(stored: string): string {
  const [ver, ivB64, tagB64, dataB64] = stored.split(".");
  if (ver !== "v1" || !ivB64 || !tagB64 || !dataB64) throw new Error("Could not read saved key");
  const decipher = createDecipheriv("aes-256-gcm", secretBytes(), Buffer.from(ivB64, "base64url"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64url"));
  const dec = Buffer.concat([decipher.update(Buffer.from(dataB64, "base64url")), decipher.final()]);
  return dec.toString("utf8");
}

export function maskKey(key: string): string {
  const trimmed = key.trim();
  if (trimmed.length < 8) return "••••";
  return `${trimmed.slice(0, 3)}…${trimmed.slice(-4)}`;
}

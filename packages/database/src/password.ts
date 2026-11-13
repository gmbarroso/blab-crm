import { argon2id, hash, verify } from "argon2";
import { randomBytes } from "node:crypto";
const options = { type: argon2id, memoryCost: 65536, timeCost: 3, parallelism: 1 } as const;
export function hashPassword(password: string) { return hash(password, options); }
export async function verifyPassword(encoded: string, password: string) {
  try { return await verify(encoded, password); } catch { return false; }
}
let dummy: Promise<string> | undefined;
/** Aplica Argon2 também a usuários inexistentes, sem senha fixa. */
export async function verifyCredentialsHash(encoded: string | undefined, password: string) {
  dummy ??= hashPassword(randomBytes(32).toString("hex"));
  const valid = await verifyPassword(encoded ?? await dummy, password);
  return encoded !== undefined && valid;
}

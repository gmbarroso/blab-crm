import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
import { z } from "zod";
export { PrismaClient };
export type { User, Organization, OrganizationMember } from "./generated/prisma/client";
export { OrganizationRole } from "./generated/prisma/client";
const globalDatabase = globalThis as unknown as { blabPrisma?: PrismaClient };
let client: PrismaClient | undefined;
/** Lazy para permitir builds sem credenciais e reutilizar conexões no HMR. */
export function getDatabase(): PrismaClient {
  if (client) return client;
  const url = z.url().refine((value) => /^postgres(ql)?:/.test(value), "DATABASE_URL deve ser PostgreSQL").parse(process.env.DATABASE_URL);
  client = globalDatabase.blabPrisma ?? new PrismaClient({
    adapter: new PrismaPg({ connectionString: url, max: 5, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000 }),
  });
  if (process.env.NODE_ENV !== "production") globalDatabase.blabPrisma = client;
  return client;
}

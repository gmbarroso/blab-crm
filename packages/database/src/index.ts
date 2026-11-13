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
  const certificate = process.env.DATABASE_SSL_CA?.trim().replace(/\\n/g, "\n");
  const connection = new URL(url);
  if (certificate) {
    if (!certificate.includes("-----BEGIN CERTIFICATE-----")) throw new Error("DATABASE_SSL_CA deve conter um certificado PEM válido.");
    // pg permite que parâmetros SSL da URL sobrescrevam a configuração explícita.
    for (const parameter of ["sslmode", "sslrootcert", "sslcert", "sslkey"]) connection.searchParams.delete(parameter);
  }
  client = globalDatabase.blabPrisma ?? new PrismaClient({
    adapter: new PrismaPg({ connectionString: connection.toString(), ...(certificate ? { ssl: { ca: certificate, rejectUnauthorized: true } } : {}), max: 5, connectionTimeoutMillis: 5000, idleTimeoutMillis: 30000 }),
  });
  if (process.env.NODE_ENV !== "production") globalDatabase.blabPrisma = client;
  return client;
}

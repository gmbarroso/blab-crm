import { defineConfig } from "prisma/config";
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // CLI usa conexão direta/session para migrations; generate não exige conexão.
  datasource: { url: process.env.DIRECT_URL?.trim() || process.env.DATABASE_URL || "" },
});

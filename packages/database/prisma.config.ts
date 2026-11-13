import { defineConfig } from "prisma/config";
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  // generate não requer acesso ao banco; comandos de migration exigem DATABASE_URL.
  datasource: { url: process.env.DATABASE_URL ?? "" },
});

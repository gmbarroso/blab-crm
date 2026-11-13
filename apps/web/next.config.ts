import type { NextConfig } from "next";
const config: NextConfig = {
  transpilePackages: ["@blab/database", "@blab/ui", "@blab/types"],
  serverExternalPackages: ["argon2", "pg", "@prisma/adapter-pg"],
  poweredByHeader: false,
};
export default config;

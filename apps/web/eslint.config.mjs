import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
export default defineConfig([...nextVitals, ...nextTs, globalIgnores([".next/**", "next-env.d.ts"]), {
  files: ["src/components/**/*.{ts,tsx}", "src/app/**/*.{ts,tsx}", "src/features/**/*.{ts,tsx}"],
  rules: { "no-restricted-imports": ["error", { patterns: [{ group: ["@blab/database", "@blab/database/*"], message: "Acesse dados via serviços no servidor." }] }] },
}]);

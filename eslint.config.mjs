import js from "@eslint/js";
import ts from "typescript-eslint";
export default ts.config(
  { ignores: ["**/node_modules/**", "**/.next/**", "**/generated/**", "**/next-env.d.ts"] },
  js.configs.recommended,
  ...ts.configs.recommended,
  { files: ["**/*.{ts,tsx,mjs}"], languageOptions: { globals: { process: "readonly", console: "readonly", URL: "readonly", URLSearchParams: "readonly", FormData: "readonly", fetch: "readonly", setTimeout: "readonly" } } },
);

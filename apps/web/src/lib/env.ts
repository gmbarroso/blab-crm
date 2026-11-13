import "server-only";
import { z } from "zod";
const schema = z.object({
  AUTH_SECRET: z.string().min(32),
  AUTH_URL: z.url().optional(),
  AUTH_TRUST_HOST: z.enum(["true", "false"]).optional(),
});
export function getAuthEnvironment() {
  const parsed = schema.safeParse(process.env);
  if (!parsed.success) throw new Error("Ambiente de autenticação inválido. Configure AUTH_SECRET (mínimo 32 caracteres) e AUTH_URL conforme .env.example.");
  return parsed.data;
}

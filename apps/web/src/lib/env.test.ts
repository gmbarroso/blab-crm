import { afterEach, expect, it, vi } from "vitest";
import { getAuthEnvironment } from "./env";
afterEach(() => vi.unstubAllEnvs());
it("rejeita AUTH_SECRET ausente ou curto sem expor seu valor", () => {
  vi.stubEnv("AUTH_SECRET", "curto");
  expect(() => getAuthEnvironment()).toThrow("Ambiente de autenticação inválido");
});
it("valida a URL pública quando fornecida", () => {
  vi.stubEnv("AUTH_SECRET", "x".repeat(48));
  vi.stubEnv("AUTH_URL", "invalida");
  expect(() => getAuthEnvironment()).toThrow();
  vi.stubEnv("AUTH_URL", "http://localhost:3000");
  expect(getAuthEnvironment().AUTH_URL).toBe("http://localhost:3000");
});

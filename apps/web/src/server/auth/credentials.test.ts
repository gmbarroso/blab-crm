import { describe, expect, it } from "vitest";
import { credentialsSchema } from "./credentials";
describe("credenciais", () => {
  it("normaliza e-mail e preserva a senha", () => {
    expect(credentialsSchema.parse({ email: " USER@Example.com ", password: " segredo " })).toEqual({ email: "user@example.com", password: " segredo " });
  });
  it.each([{ email: "invalido", password: "senha" }, { email: "a@b.com", password: "" }, { email: "a@b.com", password: "x".repeat(257) }, null])("rejeita entrada inválida %j", (value) => {
    expect(credentialsSchema.safeParse(value).success).toBe(false);
  });
});

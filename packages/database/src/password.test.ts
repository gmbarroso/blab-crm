import { describe, expect, it } from "vitest";
import { hashPassword, verifyPassword, verifyCredentialsHash } from "./password";
describe("Argon2id", () => {
  it("gera hashes com salt único e rejeita senha inválida", async () => {
    const password = "Senha de teste aleatória! 123";
    const first = await hashPassword(password);
    const second = await hashPassword(password);
    expect(first).toMatch(/^\$argon2id\$/);
    expect(first).not.toBe(second);
    expect(await verifyPassword(first, password)).toBe(true);
    expect(await verifyPassword(first, "errada")).toBe(false);
  });
  it("rejeita hash corrompido e conta inexistente", async () => {
    expect(await verifyPassword("invalido", "qualquer")).toBe(false);
    expect(await verifyCredentialsHash(undefined, "qualquer")).toBe(false);
  });
});

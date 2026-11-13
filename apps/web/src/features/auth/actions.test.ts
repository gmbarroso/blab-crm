import { beforeEach, expect, it, vi } from "vitest";
import { CredentialsSignin, AuthError } from "next-auth";
vi.mock("@/server/auth/auth", () => ({ signIn: vi.fn(), signOut: vi.fn() }));
import { signIn, signOut } from "@/server/auth/auth";
import { login, logout } from "./actions";
const form = () => { const data = new FormData(); data.set("email", "ana@example.com"); data.set("password", "senha"); return data; };
beforeEach(() => vi.resetAllMocks());
it("valida o formulário antes do Auth.js", async () => {
  expect((await login({ error: "" }, new FormData())).error).toContain("e-mail válido");
  expect(signIn).not.toHaveBeenCalled();
});
it("exibe falha genérica de credenciais", async () => {
  vi.mocked(signIn).mockRejectedValue(new CredentialsSignin());
  expect((await login({ error: "" }, form())).error).toBe("E-mail ou senha inválidos.");
});
it("trata indisponibilidade do provedor", async () => {
  vi.mocked(signIn).mockRejectedValue(new AuthError());
  expect((await login({ error: "" }, form())).error).toContain("Tente novamente");
});
it("preserva redirecionamento após login", async () => {
  const redirect = new Error("NEXT_REDIRECT");
  vi.mocked(signIn).mockRejectedValue(redirect);
  await expect(login({ error: "" }, form())).rejects.toBe(redirect);
  expect(signIn).toHaveBeenCalledWith("credentials", { email: "ana@example.com", password: "senha", redirectTo: "/dashboard" });
});
it("logout encerra a sessão e direciona ao login", async () => {
  await logout(); expect(signOut).toHaveBeenCalledWith({ redirectTo: "/login" });
});

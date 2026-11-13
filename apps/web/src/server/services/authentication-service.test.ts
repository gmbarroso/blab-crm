import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("../repositories/user-repository", () => ({ userRepository: { findForLogin: vi.fn() } }));
vi.mock("@blab/database/password", () => ({ verifyCredentialsHash: vi.fn() }));
import { userRepository } from "../repositories/user-repository";
import { verifyCredentialsHash } from "@blab/database/password";
import { authenticateCredentials } from "./authentication-service";
const user = { id: "u1", name: "Ana", email: "ana@example.com", image: null, passwordHash: "hash", createdAt: new Date(), updatedAt: new Date() };
beforeEach(() => vi.resetAllMocks());
describe("autenticação", () => {
  it("não consulta o banco para entradas inválidas", async () => {
    expect(await authenticateCredentials({})).toBeNull();
    expect(userRepository.findForLogin).not.toHaveBeenCalled();
  });
  it("retorna somente a identidade pública para credenciais válidas", async () => {
    vi.mocked(userRepository.findForLogin).mockResolvedValue(user);
    vi.mocked(verifyCredentialsHash).mockResolvedValue(true);
    expect(await authenticateCredentials({ email: "ANA@example.com", password: "senha" })).toEqual({ id: "u1", name: "Ana", email: "ana@example.com", image: null });
    expect(verifyCredentialsHash).toHaveBeenCalledWith("hash", "senha");
  });
  it("usa a mesma falha para usuário inexistente e senha incorreta", async () => {
    vi.mocked(userRepository.findForLogin).mockResolvedValue(null);
    expect(await authenticateCredentials({ email: user.email, password: "senha" })).toBeNull();
    expect(verifyCredentialsHash).toHaveBeenCalledWith(undefined, "senha");
    vi.mocked(userRepository.findForLogin).mockResolvedValue(user);
    vi.mocked(verifyCredentialsHash).mockResolvedValue(false);
    expect(await authenticateCredentials({ email: user.email, password: "senha" })).toBeNull();
  });
  it("não mascara indisponibilidade do banco como credenciais incorretas", async () => {
    vi.mocked(userRepository.findForLogin).mockRejectedValue(new Error("offline"));
    await expect(authenticateCredentials({ email: user.email, password: "senha" })).rejects.toThrow("offline");
  });
});

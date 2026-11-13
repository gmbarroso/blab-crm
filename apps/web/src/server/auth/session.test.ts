import { beforeEach, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ auth: vi.fn(), redirect: vi.fn((path: string) => { throw new Error(`redirect:${path}`); }) }));
vi.mock("./auth", () => ({ auth: mocks.auth }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("../repositories/user-repository", () => ({ userRepository: { findIdentity: vi.fn() } }));
vi.mock("../services/organization-service", () => ({ resolveOrganization: vi.fn(), assertPermission: vi.fn() }));
import { userRepository } from "../repositories/user-repository";
import { resolveOrganization, assertPermission } from "../services/organization-service";
import { getAuthenticatedUser, requireUser, requireOrganization } from "./session";
const user = { id: "u1", name: "Ana", email: "ana@example.com", image: null };
beforeEach(() => { vi.clearAllMocks(); });
it("retorna null sem sessão e não consulta identidade", async () => {
  mocks.auth.mockResolvedValue(null);
  expect(await getAuthenticatedUser()).toBeNull();
  expect(userRepository.findIdentity).not.toHaveBeenCalled();
});
it("revalida a identidade do usuário no banco", async () => {
  mocks.auth.mockResolvedValue({ user: { id: "u1" } });
  vi.mocked(userRepository.findIdentity).mockResolvedValue(user);
  expect(await getAuthenticatedUser()).toEqual(user);
  expect(userRepository.findIdentity).toHaveBeenCalledWith("u1");
});
it("nega acesso ao usuário removido mesmo com JWT válido", async () => {
  mocks.auth.mockResolvedValue({ user: { id: "u1" } });
  vi.mocked(userRepository.findIdentity).mockResolvedValue(null);
  await expect(requireUser()).rejects.toThrow("redirect:/login");
});
it("valida organização solicitada e permissão com usuário da sessão", async () => {
  mocks.auth.mockResolvedValue({ user: { id: "u1" } });
  vi.mocked(userRepository.findIdentity).mockResolvedValue(user);
  const now = new Date();
  const organization = { id: "o1", name: "B.lab", slug: "b-lab", createdAt: now, updatedAt: now };
  const membership = { id: "m1", userId: user.id, organizationId: organization.id, role: "MEMBER" as const, createdAt: now, updatedAt: now, organization };
  vi.mocked(resolveOrganization).mockResolvedValue({ organization, membership });
  expect((await requireOrganization("organization:read", "o1")).user).toEqual(user);
  expect(resolveOrganization).toHaveBeenCalledWith("u1", "o1");
  expect(assertPermission).toHaveBeenCalledWith("MEMBER", "organization:read");
});
it("propaga revogação de vínculo sem conceder acesso", async () => {
  mocks.auth.mockResolvedValue({ user: { id: "u1" } });
  vi.mocked(userRepository.findIdentity).mockResolvedValue(user);
  vi.mocked(resolveOrganization).mockRejectedValue(new Error("acesso negado"));
  await expect(requireOrganization()).rejects.toThrow("acesso negado");
  expect(assertPermission).not.toHaveBeenCalled();
});

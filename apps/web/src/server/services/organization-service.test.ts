import { beforeEach, describe, expect, it, vi } from "vitest";
vi.mock("../repositories/organization-repository", () => ({ organizationRepository: { findMembership: vi.fn() } }));
import { organizationRepository } from "../repositories/organization-repository";
import { resolveOrganization, assertPermission, OrganizationAccessError } from "./organization-service";
const membership = { id: "m1", userId: "u1", organizationId: "o1", role: "MEMBER" as const, createdAt: new Date(), updatedAt: new Date(), organization: { id: "o1", name: "B.lab", slug: "b-lab", createdAt: new Date(), updatedAt: new Date() } };
beforeEach(() => vi.resetAllMocks());
describe("contexto da organização", () => {
  it("resolve a organização ativa pelo vínculo do usuário", async () => {
    vi.mocked(organizationRepository.findMembership).mockResolvedValue(membership);
    expect((await resolveOrganization("u1")).organization.id).toBe("o1");
    expect(organizationRepository.findMembership).toHaveBeenCalledWith("u1", undefined);
  });
  it("nega usuário sem organização", async () => {
    vi.mocked(organizationRepository.findMembership).mockResolvedValue(null);
    await expect(resolveOrganization("u1")).rejects.toBeInstanceOf(OrganizationAccessError);
  });
  it("nega organização e vínculo de outro usuário mesmo com ID enviado pelo cliente", async () => {
    vi.mocked(organizationRepository.findMembership).mockResolvedValue(membership);
    await expect(resolveOrganization("u1", "o2")).rejects.toBeInstanceOf(OrganizationAccessError);
    await expect(resolveOrganization("u2", "o1")).rejects.toBeInstanceOf(OrganizationAccessError);
  });
  it("rejeita seleção de organização vazia", async () => { await expect(resolveOrganization("u1", "")).rejects.toThrow(); });
  it("impede permissões administrativas a MEMBER", () => {
    expect(() => assertPermission("MEMBER", "organization:manage")).toThrow(OrganizationAccessError);
    expect(() => assertPermission("OWNER", "organization:manage")).not.toThrow();
  });
});

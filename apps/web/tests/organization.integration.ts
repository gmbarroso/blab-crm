import { afterAll, beforeAll, expect, it } from "vitest";
import { getDatabase } from "@blab/database";
import { resolveOrganization, OrganizationAccessError, assertPermission } from "../src/server/services/organization-service";
if (process.env.BLAB_ISOLATED_TEST !== "1" || !process.env.DATABASE_URL?.includes("/blab_test_")) throw new Error("Use pnpm test:integration.");
const database = getDatabase();
let userId: string;
let organizationId: string;
let ownerId: string;
beforeAll(async () => {
  const owner = await database.user.findUniqueOrThrow({ where: { email: "admin@example.test" } });
  ownerId = owner.id;
  const organization = await database.organization.create({ data: { name: "Outro espaço", slug: "outro-espaco" } });
  organizationId = organization.id;
  const user = await database.user.create({ data: { name: "Membro de outro espaço", email: "member@example.test", passwordHash: owner.passwordHash } });
  userId = user.id;
  await database.organizationMember.create({ data: { userId, organizationId, role: "MEMBER" } });
});
afterAll(async () => {
  if (userId) await database.user.delete({ where: { id: userId } });
  if (organizationId) await database.organization.delete({ where: { id: organizationId } });
  await database.$disconnect();
});
it("resolve apenas o vínculo real do usuário no PostgreSQL", async () => {
  const context = await resolveOrganization(userId);
  expect(context.organization.id).toBe(organizationId);
  expect(context.membership.role).toBe("MEMBER");
  expect(() => assertPermission(context.membership.role, "organization:manage")).toThrow(OrganizationAccessError);
});
it("impede acesso entre organizações por ID mesmo para OWNER de outra organização", async () => {
  const ownerContext = await resolveOrganization(ownerId);
  expect(ownerContext.organization.slug).toBe("b-lab");
  await expect(resolveOrganization(ownerId, organizationId)).rejects.toBeInstanceOf(OrganizationAccessError);
  await expect(resolveOrganization(userId, ownerContext.organization.id)).rejects.toBeInstanceOf(OrganizationAccessError);
});
it("bloqueia acesso após remoção de vínculo sem depender do JWT", async () => {
  await database.organizationMember.deleteMany({ where: { userId } });
  await expect(resolveOrganization(userId)).rejects.toBeInstanceOf(OrganizationAccessError);
});

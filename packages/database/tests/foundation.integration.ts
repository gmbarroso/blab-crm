import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { getDatabase } from "../src/index";
import { bootstrap } from "../src/bootstrap";
import { verifyPassword } from "../src/password";
// O runner cria o banco temporário; URLs externas nunca são aceitas aqui.
if (process.env.BLAB_ISOLATED_TEST !== "1" || !process.env.DATABASE_URL?.includes("/blab_test_")) throw new Error("Use pnpm test:integration para criar um banco isolado.");
const database = getDatabase();
const input = { BOOTSTRAP_ADMIN_NAME: "Admin Teste", BOOTSTRAP_ADMIN_EMAIL: "admin@example.test", BOOTSTRAP_ADMIN_PASSWORD: process.env.BOOTSTRAP_ADMIN_PASSWORD! };
beforeAll(async () => { await bootstrap(database, input); });
afterAll(async () => { await database.$disconnect(); });
describe("fundação em PostgreSQL isolado", () => {
  it("bootstrap é idempotente e não troca a senha", async () => {
    const first = await database.user.findUniqueOrThrow({ where: { email: input.BOOTSTRAP_ADMIN_EMAIL } });
    await bootstrap(database, { ...input, BOOTSTRAP_ADMIN_PASSWORD: "Outra senha segura 123!" });
    const second = await database.user.findUniqueOrThrow({ where: { id: first.id } });
    expect(first.passwordHash).toBe(second.passwordHash);
    expect(await verifyPassword(second.passwordHash, input.BOOTSTRAP_ADMIN_PASSWORD)).toBe(true);
    expect(await database.organization.count()).toBe(1);
    expect(await database.organizationMember.count()).toBe(1);
  });
  it("impede vínculo duplicado e vínculos sem usuário", async () => {
    const member = await database.organizationMember.findFirstOrThrow();
    await expect(database.organizationMember.create({ data: { userId: member.userId, organizationId: member.organizationId } })).rejects.toMatchObject({ code: "P2002" });
    await expect(database.organizationMember.create({ data: { userId: "inexistente", organizationId: member.organizationId } })).rejects.toMatchObject({ code: "P2003" });
  });
  it("nega promoção de conta existente pelo bootstrap e reverte a transação", async () => {
    const member = await database.user.create({ data: { name: "Outro", email: "outro@example.test", passwordHash: "nao-usado" } });
    await expect(bootstrap(database, { ...input, BOOTSTRAP_ADMIN_EMAIL: member.email })).rejects.toThrow("Bootstrap recusado");
    expect(await database.organizationMember.count({ where: { userId: member.id } })).toBe(0);
  });
});

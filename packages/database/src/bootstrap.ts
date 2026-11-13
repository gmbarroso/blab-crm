import { z } from "zod";
import type { PrismaClient } from "./generated/prisma/client";
import { hashPassword } from "./password";
export const bootstrapSchema = z.object({
  BOOTSTRAP_ADMIN_NAME: z.string().trim().min(1).max(120),
  BOOTSTRAP_ADMIN_EMAIL: z.string().trim().toLowerCase().max(254).pipe(z.email()),
  BOOTSTRAP_ADMIN_PASSWORD: z.string().min(16).max(256),
});
export async function bootstrap(database: PrismaClient, input: unknown) {
  const values = bootstrapSchema.parse(input);
  const passwordHash = await hashPassword(values.BOOTSTRAP_ADMIN_PASSWORD);
  return database.$transaction(async (tx) => {
    const organization = await tx.organization.upsert({ where: { slug: "b-lab" }, create: { name: "B.lab", slug: "b-lab" }, update: {} });
    const existingUser = await tx.user.findUnique({ where: { email: values.BOOTSTRAP_ADMIN_EMAIL } });
    const existingMembership = existingUser && await tx.organizationMember.findUnique({ where: { userId_organizationId: { userId: existingUser.id, organizationId: organization.id } } });
    // Um script de bootstrap nunca promove uma conta preexistente ou altera sua senha.
    if (existingUser && existingMembership?.role !== "OWNER") throw new Error("Conta existente sem vínculo OWNER. Bootstrap recusado.");
    const user = existingUser ?? await tx.user.create({ data: { name: values.BOOTSTRAP_ADMIN_NAME, email: values.BOOTSTRAP_ADMIN_EMAIL, passwordHash } });
    const member = await tx.organizationMember.upsert({ where: { userId_organizationId: { userId: user.id, organizationId: organization.id } }, create: { userId: user.id, organizationId: organization.id, role: "OWNER" }, update: {} });
    return { userId: user.id, organizationId: organization.id, role: member.role };
  });
}

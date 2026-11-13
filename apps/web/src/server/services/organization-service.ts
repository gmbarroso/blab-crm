import "server-only";
import { z } from "zod";
import type { Permission } from "@blab/types";
import { organizationRepository } from "../repositories/organization-repository";
import { hasPermission } from "../organization/permissions";
export class OrganizationAccessError extends Error {
  constructor() { super("Acesso à organização negado."); }
}
/** userId deve vir da sessão validada. organizationId sempre é confrontado com o vínculo. */
export async function resolveOrganization(userId: string, organizationId?: string) {
  z.string().min(1).parse(userId);
  if (organizationId !== undefined) z.string().min(1).parse(organizationId);
  const membership = await organizationRepository.findMembership(userId, organizationId);
  if (!membership || membership.userId !== userId || (organizationId !== undefined && membership.organizationId !== organizationId)) throw new OrganizationAccessError();
  return { organization: membership.organization, membership };
}
export function assertPermission(role: Parameters<typeof hasPermission>[0], permission: Permission) {
  if (!hasPermission(role, permission)) throw new OrganizationAccessError();
}

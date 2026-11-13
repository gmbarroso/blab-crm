import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import type { Permission } from "@blab/types";
import { auth } from "./auth";
import { userRepository } from "../repositories/user-repository";
import { resolveOrganization, assertPermission } from "../services/organization-service";
export const getAuthenticatedUser = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;
  return userRepository.findIdentity(session.user.id);
});
export async function requireUser() {
  const user = await getAuthenticatedUser();
  if (!user) redirect("/login");
  return user;
}
export const getCurrentOrganization = cache(async () => {
  const user = await requireUser();
  return { user, ...await resolveOrganization(user.id) };
});
/** Use em cada Action/Route Handler privado, mesmo quando existe layout protegido. */
export async function requireOrganization(permission: Permission = "organization:read", organizationId?: string) {
  const user = await requireUser();
  const context = await resolveOrganization(user.id, organizationId);
  assertPermission(context.membership.role, permission);
  return { user, ...context };
}

import type { OrganizationRole, Permission } from "@blab/types";
const grants: Record<OrganizationRole, readonly Permission[]> = {
  OWNER: ["organization:read", "organization:manage"],
  ADMIN: ["organization:read", "organization:manage"],
  MEMBER: ["organization:read"],
};
export function hasPermission(role: OrganizationRole, permission: Permission): boolean {
  return grants[role]?.includes(permission) ?? false;
}

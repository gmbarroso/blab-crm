export const organizationRoles = ["OWNER", "ADMIN", "MEMBER"] as const;
export type OrganizationRole = (typeof organizationRoles)[number];
export type Permission = "organization:read" | "organization:manage";

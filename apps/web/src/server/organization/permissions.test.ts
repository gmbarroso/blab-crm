import { expect, it } from "vitest";
import { hasPermission } from "./permissions";
it("mantém a matriz de permissões explícita", () => {
  for (const role of ["OWNER", "ADMIN", "MEMBER"] as const) expect(hasPermission(role, "organization:read")).toBe(true);
  expect(hasPermission("ADMIN", "organization:manage")).toBe(true);
  expect(hasPermission("MEMBER", "organization:manage")).toBe(false);
});

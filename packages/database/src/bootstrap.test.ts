import { expect, it } from "vitest";
import { bootstrapSchema } from "./bootstrap";
it("bootstrap exige identidade e senha forte sem valores padrão", () => {
  expect(bootstrapSchema.safeParse({}).success).toBe(false);
  expect(bootstrapSchema.safeParse({ BOOTSTRAP_ADMIN_NAME: "Admin", BOOTSTRAP_ADMIN_EMAIL: "invalido", BOOTSTRAP_ADMIN_PASSWORD: "123" }).success).toBe(false);
  expect(bootstrapSchema.parse({ BOOTSTRAP_ADMIN_NAME: " Admin ", BOOTSTRAP_ADMIN_EMAIL: "ADMIN@example.com", BOOTSTRAP_ADMIN_PASSWORD: "uma senha longa e segura" }).BOOTSTRAP_ADMIN_EMAIL).toBe("admin@example.com");
});

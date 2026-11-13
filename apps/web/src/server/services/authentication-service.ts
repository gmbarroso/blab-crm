import "server-only";
import { verifyCredentialsHash } from "@blab/database/password";
import { credentialsSchema } from "../auth/credentials";
import { userRepository } from "../repositories/user-repository";
export async function authenticateCredentials(input: unknown) {
  const parsed = credentialsSchema.safeParse(input);
  if (!parsed.success) return null;
  const user = await userRepository.findForLogin(parsed.data.email);
  if (!await verifyCredentialsHash(user?.passwordHash, parsed.data.password) || !user) return null;
  return { id: user.id, name: user.name, email: user.email, image: user.image };
}

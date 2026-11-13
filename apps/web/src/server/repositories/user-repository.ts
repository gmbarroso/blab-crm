import "server-only";
import { getDatabase } from "@blab/database";
export const userRepository = {
  findForLogin: (email: string) => getDatabase().user.findUnique({ where: { email } }),
  findIdentity: (id: string) => getDatabase().user.findUnique({ where: { id }, select: { id: true, name: true, email: true, image: true } }),
};

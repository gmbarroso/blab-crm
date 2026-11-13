import "server-only";
import { getDatabase } from "@blab/database";
export const organizationRepository = {
  findMembership: (userId: string, organizationId?: string) => getDatabase().organizationMember.findFirst({
    where: { userId, ...(organizationId ? { organizationId } : {}) },
    include: { organization: true },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  }),
};

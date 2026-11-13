import { requireOrganization } from "@/server/auth/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  await requireOrganization();
  redirect("/dashboard");
}

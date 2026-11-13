import { Button } from "@blab/ui";
import { logout } from "@/features/auth/actions";
export function UserMenu({ name, organization }: { name: string; organization: string }) {
  return <details className="user-menu"><summary>{name}</summary><div className="user-dropdown"><span>{organization}</span><form action={logout}><Button type="submit" className="button secondary">Sair</Button></form></div></details>;
}

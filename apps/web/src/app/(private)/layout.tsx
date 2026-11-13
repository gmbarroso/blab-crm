import Link from "next/link";
import { UserMenu } from "@/components/user-menu";
import { requireUser } from "@/server/auth/session";
import { resolveOrganization, OrganizationAccessError } from "@/server/services/organization-service";
import { logout } from "@/features/auth/actions";
export default async function PrivateLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  let context;
  try { context = await resolveOrganization(user.id); }
  catch (error) {
    if (!(error instanceof OrganizationAccessError)) throw error;
    return <main className="login-page"><section className="login-card"><h1>Sem acesso a uma organização</h1><p>Solicite ao administrador a revisão do seu vínculo.</p><form action={logout}><button className="button">Sair</button></form></section></main>;
  }
  return <div className="app-shell"><aside className="sidebar"><Link className="brand" href="/">B.lab<span>CRM</span></Link><nav aria-label="Navegação principal"><Link href="/" aria-current="page">Visão geral</Link></nav><span className="muted">Fundação técnica · Fase 1</span></aside><div className="workspace"><header><span>{context.organization.name}</span><UserMenu name={user.name} organization={context.organization.name} /></header><main className="content">{children}</main></div></div>;
}

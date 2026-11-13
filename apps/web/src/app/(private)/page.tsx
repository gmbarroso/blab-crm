import { requireOrganization } from "@/server/auth/session";
export default async function HomePage() {
  const { user, organization } = await requireOrganization();
  return <><p className="eyebrow">{organization.name}</p><h1>Olá, {user.name}.</h1><p className="muted">Seu espaço de trabalho está preparado para os próximos passos.</p><section className="empty-state"><span className="empty-icon" aria-hidden="true">◎</span><h2>Nenhum módulo comercial disponível</h2><p>Os módulos de leads, contatos e oportunidades serão adicionados nas próximas fases.</p></section></>;
}

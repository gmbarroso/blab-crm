import Link from "next/link";
import { redirect } from "next/navigation";
import { getAuthenticatedUser } from "@/server/auth/session";
import { LoginForm } from "@/features/auth/login-form";
export default async function LoginPage() {
  if (await getAuthenticatedUser()) redirect("/");
  return <main className="login-page"><section className="login-card"><Link className="brand" href="/">B.lab<span>CRM</span></Link><h1>Acesse seu espaço</h1><p>Entre com suas credenciais de trabalho.</p><LoginForm /><p className="muted">O acesso é disponibilizado pelo administrador.</p></section></main>;
}

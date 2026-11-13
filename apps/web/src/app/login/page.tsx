import type { Metadata } from "next";
import Image from "next/image";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { BrandMark, BrandWordmark } from "@/components/layout/brand-mark";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { LoginForm } from "@/features/auth/login-form";
import { getAuthenticatedUser } from "@/server/auth/session";

export const metadata: Metadata = { title: "Entrar" };

const highlights = [
  "Leads, empresas e contatos em um só lugar",
  "Pipeline visual do primeiro contato ao fechamento",
  "Atividades e follow-ups sem perder prazos",
];

export default async function LoginPage() {
  if (await getAuthenticatedUser()) redirect("/dashboard");

  return (
    <div className="flex min-h-svh bg-background">
      <aside className="relative hidden w-[44%] max-w-2xl flex-col justify-between overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <BrandWordmark />
        <div className="flex flex-col gap-8">
          <Image
            src="/brand/blab-frasco-dark.png"
            alt=""
            width={240}
            height={240}
            className="size-40 rounded-3xl object-cover"
            priority
          />
          <div className="flex flex-col gap-4">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-balance">
              Onde a estratégia vira <span className="text-brand-cyan">resultado</span>.
            </h2>
            <ul className="flex flex-col gap-2.5 text-sm leading-relaxed text-sidebar-foreground/70">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-2.5">
                  <span className="size-1.5 shrink-0 rounded-sm bg-brand-violet" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="font-mono text-xs uppercase tracking-widest text-sidebar-foreground/50">
          B.lab · Laboratório de Marketing
        </p>
      </aside>

      <main className="flex flex-1 flex-col">
        <div className="flex items-center justify-between p-6">
          <span className="flex items-center gap-2 lg:invisible">
            <BrandMark />
            <BrandWordmark />
          </span>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-16">
          <div className="flex w-full max-w-sm flex-col gap-8">
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-balance">Bem-vindo de volta</h1>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Entre com suas credenciais de trabalho.
              </p>
            </div>
            <LoginForm />
            <p className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2.5 text-xs leading-relaxed text-muted-foreground">
              <ShieldCheck className="mt-0.5 size-3.5 shrink-0 text-brand-violet" aria-hidden="true" />
              O acesso é disponibilizado pelo administrador da sua organização.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

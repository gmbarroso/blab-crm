import { Building2, LogOut } from "lucide-react";
import { logout } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { BrandMark, BrandWordmark } from "@/components/layout/brand-mark";

export function NoOrganization() {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <section className="flex w-full max-w-sm flex-col gap-6 rounded-xl border bg-card p-8 text-card-foreground">
        <span className="flex items-center gap-2">
          <BrandMark />
          <BrandWordmark />
        </span>
        <div className="flex flex-col gap-2">
          <Building2 className="size-6 text-muted-foreground" aria-hidden="true" />
          <h1 className="text-xl font-bold tracking-tight">Sem acesso a uma organização</h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Solicite ao administrador a revisão do seu vínculo.
          </p>
        </div>
        <form action={logout}>
          <Button type="submit" variant="outline" className="w-full">
            <LogOut data-icon="inline-start" /> Sair
          </Button>
        </form>
      </section>
    </main>
  );
}

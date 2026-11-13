"use client";

import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="flex min-h-svh items-center justify-center bg-background p-6">
      <section className="flex w-full max-w-sm flex-col gap-4 rounded-xl border bg-card p-8 text-card-foreground">
        <h1 className="text-xl font-bold tracking-tight">Não foi possível carregar esta página</h1>
        <p className="text-sm leading-relaxed text-muted-foreground">Tente novamente em instantes.</p>
        <Button onClick={reset}>Tentar novamente</Button>
      </section>
    </main>
  );
}

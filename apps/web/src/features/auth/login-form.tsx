"use client";

import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form action={action} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="voce@blab.com.br"
          maxLength={254}
          required
          className="h-11"
          aria-invalid={Boolean(state.error) || undefined}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Senha</Label>
          <span className="text-xs text-muted-foreground">Esqueceu? Fale com o administrador</span>
        </div>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            maxLength={256}
            required
            className="h-11 pr-11"
            aria-invalid={Boolean(state.error) || undefined}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground"
            onClick={() => setShowPassword((value) => !value)}
            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </Button>
        </div>
      </div>

      <div role="status" aria-live="polite">
        {state.error && (
          <p className="flex items-center gap-2 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
            <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
            {state.error}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" className="h-11" disabled={pending}>
        {pending && <Loader2 className="animate-spin" data-icon="inline-start" />}
        {pending ? "Entrando…" : "Entrar no CRM"}
      </Button>
    </form>
  );
}

"use client";
import { useActionState } from "react";
import { Button } from "@blab/ui";
import { login } from "./actions";
export function LoginForm() {
  const [state, action, pending] = useActionState(login, { error: "" });
  return <form action={action} className="login-form">
    <label htmlFor="email">E-mail</label>
    <input id="email" name="email" type="email" autoComplete="username" maxLength={254} required />
    <label htmlFor="password">Senha</label>
    <input id="password" name="password" type="password" autoComplete="current-password" maxLength={256} required />
    <p role="status" aria-live="polite" className="form-error">{state.error}</p>
    <Button type="submit" disabled={pending} className="button">{pending ? "Entrando…" : "Entrar"}</Button>
  </form>;
}

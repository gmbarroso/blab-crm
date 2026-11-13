"use server";
import { AuthError } from "next-auth";
import { signIn, signOut } from "@/server/auth/auth";
import { credentialsSchema } from "@/server/auth/credentials";
export type LoginState = { error: string };
export async function login(_previous: LoginState, form: FormData): Promise<LoginState> {
  const parsed = credentialsSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { error: "Informe um e-mail válido e sua senha." };
  try { await signIn("credentials", { ...parsed.data, redirectTo: "/dashboard" }); }
  catch (error) {
    if (error instanceof AuthError) return { error: error.type === "CredentialsSignin" ? "E-mail ou senha inválidos." : "Não foi possível entrar. Tente novamente." };
    throw error; // Preserva o redirecionamento do Next.js.
  }
  return { error: "" };
}
export async function logout() { await signOut({ redirectTo: "/login" }); }

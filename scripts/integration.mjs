import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:net";
const root = fileURLToPath(new URL("../", import.meta.url));
const pgBin = process.env.PG_BIN ?? "/usr/lib/postgresql/16/bin";
const temporary = await mkdtemp(join(tmpdir(), "blab-test-"));
const databaseName = `blab_test_${randomBytes(6).toString("hex")}`;
const password = randomBytes(32).toString("base64url");
const data = join(temporary, "data");
let pgStarted = false;
let web;
let webOutput = "";
function run(command, args, env = process.env) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { cwd: root, env, stdio: "inherit" });
    child.on("error", reject);
    child.on("exit", (code) => code === 0 ? resolve() : reject(new Error(`${command} terminou com código ${code}`)));
  });
}
async function freePort() {
  const server = createServer();
  await new Promise((resolve, reject) => { server.once("error", reject); server.listen(0, "127.0.0.1", resolve); });
  const { port } = server.address();
  await new Promise((resolve) => server.close(resolve));
  return port;
}
const cookies = new Map();
let base;
async function request(path, init = {}) {
  const response = await fetch(`${base}${path}`, { ...init, redirect: "manual", headers: { ...init.headers, cookie: [...cookies].map(([key, value]) => `${key}=${value}`).join("; ") } });
  for (const cookie of response.headers.getSetCookie()) {
    const pair = cookie.split(";", 1)[0];
    const index = pair.indexOf("=");
    const key = pair.slice(0, index), value = pair.slice(index + 1);
    if (value) cookies.set(key, value); else cookies.delete(key);
  }
  return response;
}
async function assertRedirect(response, destination) {
  if (response.status === 307) {
    assert.equal(new URL(response.headers.get("location"), base).pathname, destination);
    return;
  }
  // loading.tsx permite que redirects autenticados sejam enviados no HTML em streaming.
  assert.equal(response.status, 200);
  const html = await response.text();
  const meta = html.match(/<meta\b[^>]*http-equiv="refresh"[^>]*>/i)?.[0];
  const target = meta?.match(/content="[^"]*url=([^"]+)"/i)?.[1];
  assert(target, "Redirect em streaming deve conter meta refresh");
  assert.equal(new URL(target, base).pathname, destination);
}
async function postWithCsrf(path, fields) {
  const { csrfToken } = await (await request("/api/auth/csrf")).json();
  return request(path, { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", "X-Auth-Return-Redirect": "1" }, body: new URLSearchParams({ ...fields, csrfToken, callbackUrl: `${base}/` }) });
}
try {
  await mkdir(join(temporary, "socket"));
  const pwfile = join(temporary, "pg-password");
  await writeFile(pwfile, password, { mode: 0o600 });
  const pgPort = await freePort();
  const webPort = await freePort();
  base = `http://localhost:${webPort}`;
  // Sempre cria um cluster novo; não carrega .env nem aceita DATABASE_URL externa.
  const env = { ...process.env, DATABASE_URL: `postgresql://blab_test:${password}@127.0.0.1:${pgPort}/${databaseName}`, AUTH_SECRET: randomBytes(48).toString("base64url"), AUTH_URL: base, AUTH_TRUST_HOST: "true", BLAB_ISOLATED_TEST: "1", BOOTSTRAP_ADMIN_NAME: "Admin Teste", BOOTSTRAP_ADMIN_EMAIL: "admin@example.test", BOOTSTRAP_ADMIN_PASSWORD: randomBytes(32).toString("base64url"), NEXT_TELEMETRY_DISABLED: "1" };
  await run(join(pgBin, "initdb"), ["-D", data, "-U", "blab_test", "--auth-local=trust", "--auth-host=scram-sha-256", `--pwfile=${pwfile}`, "--no-locale", "--encoding=UTF8"]);
  await run(join(pgBin, "pg_ctl"), ["-D", data, "-l", join(temporary, "postgres.log"), "-o", `-p ${pgPort} -h 127.0.0.1 -k ${join(temporary, "socket")}`, "-w", "start"]);
  pgStarted = true;
  await run(join(pgBin, "createdb"), ["-h", join(temporary, "socket"), "-p", String(pgPort), "-U", "blab_test", databaseName]);
  await run("pnpm", ["--filter", "@blab/database", "db:generate"], env);
  await run("pnpm", ["--filter", "@blab/database", "db:migrate:deploy"], env);
  await run("pnpm", ["--filter", "@blab/database", "db:migrate:deploy"], env);
  await run("pnpm", ["--filter", "@blab/database", "bootstrap"], env);
  await run("pnpm", ["--filter", "@blab/database", "exec", "vitest", "run", "--config", "vitest.integration.config.ts"], env);
  await run("pnpm", ["--filter", "@blab/web", "exec", "vitest", "run", "--config", "vitest.integration.config.ts"], env);
  await run("pnpm", ["exec", "turbo", "build"], env);
  web = spawn("pnpm", ["--filter", "@blab/web", "exec", "next", "start", "-p", String(webPort)], { cwd: root, env, stdio: ["ignore", "pipe", "pipe"], detached: true });
  web.stdout.on("data", (chunk) => { webOutput += chunk; });
  web.stderr.on("data", (chunk) => { webOutput += chunk; });
  let ready = false;
  for (let i = 0; i < 100; i++) {
    if (web.exitCode !== null) throw new Error("Servidor Next.js encerrou antes de iniciar");
    try { if ((await fetch(`${base}/login`)).status === 200) { ready = true; break; } } catch { /* aguardando inicialização */ }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  assert(ready, "Servidor deve iniciar");
  const privatePaths = ["/", "/dashboard", "/leads", "/empresas", "/empresas/cmp-01", "/contatos", "/pipeline", "/atividades", "/relatorios", "/configuracoes"];
  for (const path of privatePaths) {
    const denied = await request(path);
    assert.equal(denied.status, 307, `Rota privada sem sessão: ${path}`);
    assert.equal(new URL(denied.headers.get("location"), base).pathname, "/login");
  }
  let response = await request("/");
  assert.equal(response.status, 307);
  assert.equal(new URL(response.headers.get("location"), base).pathname, "/login");
  response = await postWithCsrf("/api/auth/callback/credentials", { email: env.BOOTSTRAP_ADMIN_EMAIL, password: "incorreta" });
  assert((await response.json()).url.includes("error=CredentialsSignin"));
  assert.equal((await (await request("/api/auth/session")).json()), null);
  response = await postWithCsrf("/api/auth/callback/credentials", { email: env.BOOTSTRAP_ADMIN_EMAIL, password: env.BOOTSTRAP_ADMIN_PASSWORD });
  assert(!(await response.json()).url.includes("error="));
  const session = await (await request("/api/auth/session")).json();
  assert.equal(session.user.email, env.BOOTSTRAP_ADMIN_EMAIL);
  assert(session.user.id);
  assert(!JSON.stringify(session).includes("passwordHash"));
  response = await request("/");
  await assertRedirect(response, "/dashboard");
  response = await request("/dashboard");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert(html.includes("Admin Teste"));
  assert(html.includes("B.lab"));
  assert(html.includes("Dados de demonstração"));
  for (const path of privatePaths.filter((path) => path !== "/")) {
    assert.equal((await request(path)).status, 200, `Rota privada com sessão: ${path}`);
  }
  const settings = await (await request("/configuracoes")).text();
  assert(settings.includes(env.BOOTSTRAP_ADMIN_EMAIL));
  assert(!settings.includes("Ana Souza"));
  assert.equal((await request("/login")).status, 307);
  // Auth.js recusa signout sem CSRF e mantém a sessão.
  await request("/api/auth/signout", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ callbackUrl: `${base}/login` }) });
  assert((await (await request("/api/auth/session")).json())?.user);
  await postWithCsrf("/api/auth/signout", {});
  assert.equal(await (await request("/api/auth/session")).json(), null);
  assert.equal((await request("/")).status, 307);
  console.log("✓ HTTP: proteção de rotas, credenciais inválidas, login, sessão, usuário/organização, redirecionamento, CSRF e logout.");
} catch (error) {
  console.error(error);
  // Evita imprimir configuração sensível nos logs de falha.
  if (webOutput) console.error(webOutput.replaceAll(password, "[REDACTED]"));
  process.exitCode = 1;
} finally {
  if (web?.pid && web.exitCode === null) {
    process.kill(-web.pid, "SIGTERM");
    await new Promise((resolve) => web.once("exit", resolve));
  }
  if (pgStarted) await run(join(pgBin, "pg_ctl"), ["-D", data, "-m", "fast", "-w", "stop"]);
  await rm(temporary, { recursive: true, force: true });
}

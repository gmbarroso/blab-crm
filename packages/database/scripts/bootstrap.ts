import { getDatabase } from "../src/index";
import { bootstrap, bootstrapSchema } from "../src/bootstrap";
const parsed = bootstrapSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("Bootstrap: informe nome, e-mail válido e senha de 16 a 256 caracteres pelas variáveis BOOTSTRAP_ADMIN_*.");
  process.exitCode = 1;
} else {
  const database = getDatabase();
  try { await bootstrap(database, parsed.data); console.log("Bootstrap concluído. Organização B.lab e usuário OWNER disponíveis."); }
  catch { console.error("Bootstrap recusado ou banco indisponível. Nenhuma credencial foi exibida. Verifique configuração e vínculos existentes."); process.exitCode = 1; }
  finally { await database.$disconnect(); }
}

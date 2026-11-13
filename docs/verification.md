# Verificação da entrega

Executada em 12/11/2026, com Node 22.15.0, pnpm 10.20.0 e PostgreSQL 16.

| Comando | Resultado |
| --- | --- |
| `pnpm install --store-dir /tmp/blab-pnpm-store` | Dependências instaladas, lockfile criado, sem conflitos de peers relatados |
| `pnpm install --frozen-lockfile --offline --store-dir /tmp/blab-pnpm-store` | Lockfile consistente; instalação reproduzível usando o cache |
| `pnpm db:generate` | Prisma Client 7.10.1 gerado sem DATABASE_URL |
| `pnpm lint` | Scripts e quatro pacotes com código aprovados |
| `pnpm typecheck` | Aplicação, testes, configurações e pacotes aprovados |
| `pnpm test` | 30 testes de unidade aprovados: 27 em web e 3 em database |
| `pnpm test:integration` | 6 testes em PostgreSQL real e fluxo HTTP completo aprovados |
| `pnpm build` | Build Next.js/Turbo aprovado, inclusive sem DATABASE_URL e AUTH_SECRET |
| `pnpm dev` | Next.js iniciou e ficou Ready; encerrado após smoke test |

## Integração real

O runner cria cluster PostgreSQL novo em diretório temporário privado e usa portas locais e credenciais aleatórias. Não lê `.env` e sobrescreve qualquer DATABASE_URL herdada antes de executar os testes.

Foram verificados:

- Aplicação da migration inicial e segunda execução sem migrations pendentes.
- Bootstrap manual via CLI, idempotência, preservação de senha e recusa de promoção de conta existente.
- Constraints de unicidade de vínculo e foreign keys.
- Resolução real de organização pelo serviço/repositório, bloqueio de acesso entre duas organizações e revogação de vínculo.
- Build de produção e inicialização do servidor Next.js.
- Redirecionamento da área privada para login sem sessão.
- Rejeição de credenciais inválidas, login válido e cookie de sessão.
- Sessão contendo somente identidade pública; nome e organização renderizados na área privada.
- Redirecionamento de usuário autenticado ao acessar login.
- Proteção CSRF no signout e logout válido encerrando a sessão.

O servidor e o cluster temporário foram encerrados e removidos. Nenhum banco externo foi acessado ou criado.

## Condições do ambiente

Instalação exigiu acesso ao registry npm. A sandbox inicialmente bloqueou DNS e portas locais; os comandos foram executados com a permissão de ambiente necessária para baixar dependências e iniciar processos locais. O `pnpm dev` usou a porta 3004 porque a porta padrão estava ocupada; o processo de terceiros não foi alterado.

Na sandbox, `.git` aparece como diretório vazio sintético e o Turborepo chegou a falhar ao consultar arquivos Git durante um build. O mesmo comando executado fora dessa restrição passou. Nenhum metadado Git foi removido, criado ou modificado; fora da sandbox não havia repositório Git inicializado.

A instalação reportou depreciação do ESLint 9; essa linha foi mantida por compatibilidade com a configuração Next.js instalada. Auth.js v5 usa a versão beta explicitamente fixada. Migrations de desenvolvimento/Studio foram configurados, mas não executados em banco do usuário. Compose e deploy Vercel não foram executados.

## Pendências externas

- Fornecer os fontes originais do v0 para migração e validação visual.
- Configurar PostgreSQL persistente e `.env` real.
- Aplicar migration e executar bootstrap no ambiente desejado.
- Disponibilizar repositório Git e configurar projeto/domínio/variáveis na Vercel.
- Configurar limitação de tentativas de login no proxy/firewall antes de exposição pública.

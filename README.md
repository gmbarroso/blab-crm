# B.lab CRM

Fundação de um SaaS de gerenciamento comercial da B.lab. Fase 1: autenticação, organizações e infraestrutura. Nenhum CRUD comercial foi implementado.

> A interface v0 foi recebida na branch `feat/frontend-crm-ui` e integrada ao monorepo. Login, sessão e vínculo organizacional são reais. Os dados fictícios foram removidos. Dashboard, leads, empresas, contatos, pipeline, atividades e relatórios exibem estados vazios; os formulários comerciais ainda não gravam no banco. Conectar um PostgreSQL não transforma esses módulos em CRUD real.

## Tecnologias e estrutura

Node.js 22.12+ (linha 22), pnpm 10.20, Turborepo, TypeScript, Next.js 16.4.6 App Router, React 19.3.1, Auth.js `next-auth` 5.0.0-beta.32, Prisma 7.10.1, PostgreSQL 16, Argon2id, Zod e Vitest. O lockfile fixa a resolução completa. Auth.js v5 permanece em beta na versão selecionada; atualizações exigem validar os fluxos HTTP.

```text
apps/web/src/
  app/                 # login, área privada e handlers Auth.js
  components/          # componentes específicos da aplicação
  features/auth/       # formulário e Server Actions
  hooks/               # comportamento responsivo da interface
  lib/                 # ambiente validado no servidor
  server/
    auth/              # Auth.js e sessão
    organization/      # permissões
    services/          # regras de autenticação e organização
    repositories/      # acesso ao banco
packages/
  database/            # Prisma, migration e bootstrap
  ui/                  # primitiva Button sem identidade visual
  types/               # contratos de roles e permissões sem dependências de servidor
  config/              # configuração TypeScript compartilhada
scripts/               # carregamento de .env e integração isolada
```

## Instalação e configuração

```bash
corepack enable
corepack prepare pnpm@10.20.0 --activate
pnpm install --frozen-lockfile
cp .env.example .env
openssl rand -base64 48
```

Preencha `AUTH_SECRET` com o segredo gerado. Configure `DATABASE_URL` com uma instância PostgreSQL real, `AUTH_URL` com a origem da aplicação e as variáveis do bootstrap. Os comandos da raiz de desenvolvimento, build, migrations, Studio e bootstrap carregam `.env` da raiz usando Node; variáveis já existentes no processo têm precedência. Comandos executados diretamente dentro dos pacotes exigem as variáveis exportadas no shell.

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | PostgreSQL; validada quando o banco é acessado |
| `DIRECT_URL` | Opcional: conexão direta/Session Pooler usada pela CLI Prisma; se vazia, usa DATABASE_URL |
| `DATABASE_SSL_CA` | Opcional: conteúdo PEM da CA para TLS verificado, sem arquivo local; aceita quebras de linha ou \n literais |
| `AUTH_SECRET` | Segredo com pelo menos 32 caracteres; obrigatório ao usar autenticação |
| `AUTH_URL` | Origem pública, como `http://localhost:3000`; validada quando fornecida |
| `AUTH_TRUST_HOST` | Opcional; `true` somente atrás de proxy com Host confiável. Vercel é detectada automaticamente |
| `BOOTSTRAP_ADMIN_NAME` | Nome do primeiro administrador |
| `BOOTSTRAP_ADMIN_EMAIL` | E-mail do administrador, normalizado para minúsculas |
| `BOOTSTRAP_ADMIN_PASSWORD` | Senha de 16 a 256 caracteres; somente no bootstrap |
| `POSTGRES_PASSWORD` | Somente para o PostgreSQL local via Compose |

Não existem variáveis `NEXT_PUBLIC_*` sensíveis. Não comite `.env`. O build não precisa de conexão ou credenciais reais; a validação ocorre no uso do servidor.

## Banco e migrations

Use PostgreSQL local/gerenciado. Opcionalmente, configure `POSTGRES_PASSWORD` em `.env` e inicie o banco de desenvolvimento:

```bash
docker compose up -d db
```

O Compose publica apenas `127.0.0.1:5432`, cria usuário `blab` e banco `blab_crm`. Preencha `DATABASE_URL` com a mesma senha (URL-encode se necessário). O volume conserva os dados. Não use este Compose como receita de produção.

```bash
pnpm db:generate
pnpm db:migrate:deploy
```

A migration inicial versionada cria apenas User, Organization e OrganizationMember, além do enum de roles. Para mudanças futuras em um banco **de desenvolvimento**:

```bash
pnpm db:migrate:dev --name nome_da_mudanca
pnpm db:studio
```

`migrate dev` pode solicitar reset em caso de divergência; use somente em desenvolvimento e revise a solicitação. Não altere migrations já aplicadas. `migrate deploy` aplica migrations pendentes explicitamente; não roda no build ou startup.

## Bootstrap administrativo

Defina `BOOTSTRAP_ADMIN_NAME`, `BOOTSTRAP_ADMIN_EMAIL` e `BOOTSTRAP_ADMIN_PASSWORD` em `.env` ou no ambiente de um terminal confiável e execute:

```bash
pnpm bootstrap
```

Cria a organização `B.lab` (`b-lab`), o usuário e seu vínculo OWNER em uma transação. Reexecução para o mesmo OWNER não troca senha, nome nem role. Conta existente sem vínculo OWNER é recusada: o script não serve para promover usuários ou redefinir senhas. Falhas revertem a transação. Não existe cadastro público ou seed automático. Remova as variáveis `BOOTSTRAP_ADMIN_*` após executar. Não informe a senha como argumento de linha de comando.

## Desenvolvimento e verificações

```bash
pnpm dev
# http://localhost:3000
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

`pnpm test` roda testes de unidade sem conexão ao banco. Dublês de repositórios são restritos a testes; a aplicação utiliza PostgreSQL real. Cobertura inclui validação, hash, autenticação, erros, redirects, logout, organização, isolamento de vínculos e permissões.

```bash
pnpm test:integration
```

A integração exige binários PostgreSQL 16 (`initdb`, `pg_ctl`, `createdb`), usuário sem privilégios root e portas locais liberadas. Por padrão usa `/usr/lib/postgresql/16/bin`; defina `PG_BIN` para outro caminho. O runner **não lê `.env` nem utiliza DATABASE_URL ou DIRECT_URL externas**: cria cluster, banco, credenciais e segredo temporários; aplica a migration duas vezes; executa bootstrap e testes de constraints/idempotência e isolamento real entre organizações; faz build e sobe Next.js para testar os endpoints Auth.js por HTTP, cookies, redirects, CSRF, login e logout. No encerramento normal ou em falhas tratadas, para os processos e remove o cluster temporário. Não execute em paralelo com `pnpm dev` ou outro build, pois compartilham `.next`.

## Deploy na Vercel

1. Importe o repositório `gmbarroso/blab-crm` no projeto Vercel e use a branch `main` para produção.
2. Importe o monorepo e selecione **Root Directory: `apps/web`**, framework **Next.js**, Node **22.x** e habilite a inclusão de arquivos externos ao Root Directory.
3. Install Command: `pnpm install --frozen-lockfile`. O workspace e o lockfile ficam na raiz do repositório.
4. Build Command: `cd ../.. && pnpm build`. Output Directory: padrão do Next.js (`.next` de `apps/web`). O Next transpila os pacotes locais e o Turbo gera o Prisma Client antes do build.
5. Configure `DATABASE_URL`, `AUTH_SECRET` e `AUTH_URL=https://seu-dominio` no ambiente correto. Não copie as variáveis de bootstrap para o runtime público. Utilize PostgreSQL acessível à Vercel, TLS conforme o provedor e pooling adequado à quantidade de instâncias. Cada processo limita seu pool a cinco conexões.
6. Em uma etapa explícita de release, com URL de conexão apropriada para migrations, execute `pnpm db:migrate:deploy`. Revise o SQL antes de aplicar em produção. Não há migrations automáticas no build.
7. Execute `pnpm bootstrap` em ambiente administrativo confiável com acesso ao banco e depois remova as credenciais de bootstrap. Valide login/logout no domínio final.

Use bancos e segredos diferentes para Preview e Production. `AUTH_TRUST_HOST=true` é permitido somente se o proxy sanitizar os cabeçalhos Host; Vercel habilita a confiança automaticamente. HTTPS permite cookies seguros geridos pelo Auth.js. Configure controle de tentativas de login no firewall/proxy da implantação antes de expor o serviço publicamente: esta fase não inclui rate limiting distribuído.

Nenhuma conta Vercel, domínio ou banco externo foi provisionado nesta entrega. Não houve publicação ou alteração de banco de produção.

## Limitações da fase

Os módulos comerciais estão vazios e em preparação: não há modelos ou operações de persistência para leads, empresas, contatos, oportunidades ou atividades. Os perfis e nomes da sessão são reais, inclusive em Configurações; as edições de perfil/organização/preferências ainda são simuladas.

A organização ativa é o primeiro vínculo válido por `createdAt`, com `id` como desempate. Não há seletor, convites, cadastro, recuperação de senha ou administração de usuários. A sessão JWT dura oito horas; o acesso privado revalida a existência do usuário e o vínculo no banco em cada requisição. Alterar a senha não revoga JWTs existentes automaticamente; remoção de usuário/vínculo bloqueia os dados privados imediatamente. Evoluções de revogação de sessões e proteção contra tentativas distribuídas ficam para a etapa de endurecimento operacional.

Para configurar Supabase, Vercel e `crm.blabti.com`, siga [publicação e uso real](docs/deployment.md).

Veja [arquitetura](docs/architecture.md), [análise e migração](docs/migration-plan.md) e [verificação](docs/verification.md).

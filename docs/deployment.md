# Publicação e uso real: Supabase + Vercel

## O que fica disponível nesta entrega

A aplicação pode ser publicada com autenticação e organização reais. O banco contém somente User, Organization e OrganizationMember. As páginas comerciais são uma demonstração de interface: leads, empresas, contatos, oportunidades, atividades, métricas e relatórios ainda vêm de arquivos em `apps/web/src/lib/mock`. Os formulários mostram que nada é salvo.

Não basta conectar o banco para começar a cadastrar negócios reais. A próxima fase precisa criar os modelos/migrations e os casos de uso comerciais, com validação, autorização por organização e testes. Não importe os dados fictícios para produção.

## 1. Criar o banco no Supabase

Crie um projeto Supabase dedicado ao ambiente. A aplicação utiliza o PostgreSQL via Prisma e Auth.js; usuários são registros na tabela User, não contas do Supabase Auth. Não são necessárias chaves públicas/anon do SDK Supabase.

No painel Connect, obtenha as strings adequadas: runtime serverless via pooler e migrations/bootstrap via conexão direta ou Session Pooler compatível com a rede. A conexão direta pode exigir IPv6; use as opções indicadas pelo painel. Preserve os requisitos TLS do provedor. Para este projeto, que acessa dados apenas por Prisma no servidor, desative a Data API nas configurações do Supabase para não expor tabelas, incluindo hashes de senha. Utilize credenciais PostgreSQL próprias para a aplicação conforme o guia oficial.

Referência: [Prisma no Supabase](https://supabase.com/docs/guides/database/prisma).

## 2. Criar as tabelas e o primeiro usuário

Em um computador confiável, clone o repositório, instale as dependências e copie `.env.example` para `.env`. Configure DATABASE_URL com a conexão de runtime (Transaction Pooler) e DIRECT_URL com a conexão direta ou Session Pooler (porta 5432) do projeto correto. A CLI Prisma prioriza DIRECT_URL para migrations e Studio; se vazia, usa DATABASE_URL. O bootstrap usa DATABASE_URL pelo cliente da aplicação. Não publique esse arquivo ou envie senhas em conversas.

```bash
pnpm install --frozen-lockfile
pnpm db:generate
pnpm db:migrate:deploy
```

Configure em `.env` o nome, e-mail e uma senha longa nas variáveis BOOTSTRAP_ADMIN_* e execute:

```bash
pnpm bootstrap
```

O comando cria a organização B.lab e o usuário OWNER. Remova as variáveis de bootstrap após executar. Reexecuções não redefinem senhas. Nunca use migrate dev, reset ou db push como procedimento de implantação em produção. As migrations ficam fora do build Vercel.

## 3. Publicar na Vercel

Importe `gmbarroso/blab-crm`. Configure:

| Campo | Valor |
| --- | --- |
| Production Branch | main |
| Framework | Next.js |
| Root Directory | apps/web |
| Arquivos fora do Root Directory | Habilitados |
| Node.js | 22.x |
| Install Command | pnpm install --frozen-lockfile |
| Build Command | cd ../.. && pnpm build |
| Output Directory | Padrão Next.js |

Variáveis de Production:

- DATABASE_URL: conexão runtime ao PostgreSQL do Supabase, usando pooling adequado ao ambiente serverless.
- DIRECT_URL: conexão direta/Session Pooler para comandos Prisma executados nesse ambiente; não é necessária ao runtime.
- DATABASE_SSL_CA: conteúdo do certificado CA PEM do Supabase. Com essa variável, o driver valida TLS sem depender de arquivos locais; remova sslrootcert/sslcert e seus caminhos da URL configurada na Vercel.
- AUTH_SECRET: gere um segredo novo com `openssl rand -base64 48` e armazene-o na Vercel; não o altere entre deploys sem intenção de invalidar sessões.
- AUTH_URL: `https://crm.blabti.com` quando o domínio estiver configurado; inicialmente pode usar a origem Vercel escolhida para validar.

Para a primeira publicação no domínio Vercel, AUTH_URL pode ficar ausente: Auth.js usa a origem da requisição na Vercel. Após configurar crm.blabti.com, defina AUTH_URL para essa origem e publique novamente.

Vercel é detectada como proxy confiável pelo Auth.js. Não publique variáveis BOOTSTRAP_ADMIN_* no runtime. Use banco e segredo separados para Preview e Production. Configure limitação de tentativas de login no firewall/proxy antes de liberar o acesso público. O build utiliza next/font e precisa baixar as fontes Google.

Referência: [Turborepo na Vercel](https://vercel.com/docs/monorepos/turborepo).

## 4. Conectar crm.blabti.com

Adicione `crm.blabti.com` em Settings → Domains do projeto Vercel. No provedor de DNS de blabti.com, crie o registro CNAME `crm` com o destino exato informado pelo painel da Vercel. Aguarde a validação e a emissão HTTPS, ajuste AUTH_URL e faça novo deploy para aplicar a variável. O banco continua acessado apenas pelo servidor; não precisa de subdomínio público próprio.

Referência: [Domínio na Vercel](https://vercel.com/docs/domains/set-up-custom-domain).

## 5. Validar e planejar a operação comercial

Acesse o domínio, confirme que /dashboard exige login, entre com o OWNER, confira seu nome e a organização B.lab, navegue pelas páginas identificadas como demonstração e teste Sair. Não use os formulários demonstrativos para armazenar informações reais: não há persistência comercial nesta fase.

Para uso comercial, a próxima entrega deve implementar primeiro o módulo de leads com tabelas e índices por organização, repositórios/serviços, criação/edição/exclusão autorizadas e integração da tela existente. Empresas, contatos, oportunidades e atividades seguem em etapas próprias. A administração de usuários e recuperação de senha também não estão disponíveis ainda.

Nenhum projeto Supabase/Vercel ou registro DNS foi criado automaticamente nesta revisão. A configuração exige acesso às contas e aos ambientes reais.

## TLS e proteção das tabelas de identidade

As tabelas User, Organization e OrganizationMember têm RLS habilitada e não concedem acesso às roles públicas anon/authenticated. O Prisma acessa pelo servidor com credenciais PostgreSQL autorizadas. Isso não integra Auth.js às políticas de Supabase Auth.

Se o pooler retornar SELF_SIGNED_CERT_IN_CHAIN, obtenha a CA oficial na seção SSL Configuration do Supabase e configure o cliente para verificá-la. No ambiente local desta configuração, a CA fica em `.certs/supabase-ca.crt`, fora do Git. A conexão de runtime pg usa `sslmode=verify-full` e `sslrootcert` com o caminho do certificado; a CLI Prisma usa `sslmode=require`, `sslaccept=strict` e `sslcert` apontando à CA. As opções dos dois drivers são diferentes. Não desative a verificação TLS como solução.

Caminhos absolutos locais de certificado não funcionam na Vercel. Na Vercel, configure DATABASE_SSL_CA com o conteúdo PEM da CA e use DATABASE_URL sem parâmetros de caminhos locais. O cliente exige validação do certificado com rejectUnauthorized=true e remove os parâmetros SSL da URL que poderiam sobrescrever essa configuração. DIRECT_URL e certificados em arquivo continuam disponíveis para a CLI Prisma executada no computador administrativo. Não copie as URLs locais com caminhos de arquivo sem essa adaptação. Referências: [SSL no Supabase](https://supabase.com/docs/guides/platform/ssl-enforcement) e [TLS nos drivers Prisma/pg](https://www.prisma.io/postgres/ssl-connection-error).

## Importar as variáveis deste workspace

Foi preparado localmente um arquivo `.env.vercel` privado, ignorado pelo Git, com DATABASE_URL sem caminhos de certificado, DATABASE_SSL_CA e um AUTH_SECRET exclusivo de produção. Na Vercel, use Import .env em Environment Variables e selecione esse arquivo, restringindo as variáveis ao ambiente Production. Não importe o .env de bootstrap para a publicação. O certificado aceita quebras de linha reais ou `\n` literais.

Esse arquivo não é distribuído com o repositório; em outros computadores configure essas três variáveis no painel. O usuário e as migrations já existentes no Supabase não precisam ser recriados a cada deploy.
